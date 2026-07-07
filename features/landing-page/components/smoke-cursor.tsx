'use client';

import { useEffect, useRef } from 'react';

/**
 * SmokeCursor renders a WebGL fluid simulation that reacts to the pointer
 * (mouse + touch), leaving a glowing, smoke-like trail tinted toward the
 * Statix brand orange. It is a self-contained, dependency-free port of the
 * well-known GPU fluid solver (advection + Jacobi pressure projection).
 *
 * Unlike the full-screen auth-backdrop variant, this one is meant to fill a
 * positioned parent section: pointer coordinates are resolved relative to the
 * canvas rect (not the viewport), and the simulation pauses whenever the
 * section is scrolled out of view so it never taxes the GPU for the rest of
 * the page. The canvas is transparent where there is no smoke, so it layers
 * cleanly over a dark section background.
 *
 * It disables itself when the user prefers reduced motion or WebGL is
 * unavailable.
 */

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: { r: number; g: number; b: number };
}

function createPointer(): Pointer {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 },
  };
}

interface GLContext {
  gl: WebGL2RenderingContext | WebGLRenderingContext;
  ext: {
    formatRGBA: { internalFormat: number; format: number } | null;
    formatRG: { internalFormat: number; format: number } | null;
    formatR: { internalFormat: number; format: number } | null;
    halfFloatTexType: number;
    supportLinearFiltering: object | null;
  };
}

export default function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // Tunable simulation parameters. Kept conservative so the effect stays
    // smooth on tablets/phones where the marketing page is commonly viewed.
    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 1.6,
      VELOCITY_DISSIPATION: 1.8,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 34,
      SPLAT_RADIUS: 0.28,
      SPLAT_FORCE: 7200,
      SHADING: true,
      // Ambient bursts keep the smoke alive even when the pointer is idle, so
      // the band reads as a living plume instead of a dead canvas.
      AMBIENT_INTERVAL: 900,
    };

    const pointers: Pointer[] = [createPointer()];

    const ctx = getWebGLContext(canvas);
    if (!ctx) return;
    const { gl, ext } = ctx;

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 512;
      config.SHADING = false;
    }

    // ---- Shader helpers -------------------------------------------------

    function compileShader(
      type: number,
      source: string,
      keywords?: string[]
    ): WebGLShader | null {
      const fullSource = keywords ? addKeywords(source, keywords) : source;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, fullSource);
      gl.compileShader(shader);
      return shader;
    }

    function addKeywords(source: string, keywords: string[]): string {
      let prefix = '';
      keywords.forEach((keyword) => {
        prefix += `#define ${keyword}\n`;
      });
      return prefix + source;
    }

    function createProgram(
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader
    ): WebGLProgram | null {
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      return program;
    }

    function getUniforms(
      program: WebGLProgram
    ): Record<string, WebGLUniformLocation | null> {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (!info) continue;
        uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      return uniforms;
    }

    class Program {
      program: WebGLProgram;
      uniforms: Record<string, WebGLUniformLocation | null>;
      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = createProgram(vertexShader, fragmentShader)!;
        this.uniforms = getUniforms(this.program);
      }
      bind() {
        gl.useProgram(this.program);
      }
    }

    // ---- Shaders --------------------------------------------------------

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`
    )!;

    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }`
    )!;

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }`
    )!;

    const displayShaderSource = `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);
          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
        #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }`;

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }`
    )!;

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }`,
      ext.supportLinearFiltering ? undefined : ['MANUAL_FILTERING']
    )!;

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }`
    )!;

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }`
    )!;

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`
    )!;

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }`
    )!;

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`
    )!;

    // ---- Blit / framebuffers -------------------------------------------

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      return (target: FBO | null, clear = false) => {
        if (!target) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (clear) {
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    interface FBO {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    }

    interface DoubleFBO {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
      swap: () => void;
    }

    function createFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeFBO(
      target: FBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(
      target: DoubleFBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(
        target.read,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      );
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    // ---- Programs -------------------------------------------------------

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradientSubtractProgram = new Program(
      baseVertexShader,
      gradientSubtractShader
    );
    const displayProgram = new Program(
      baseVertexShader,
      compileShader(
        gl.FRAGMENT_SHADER,
        displayShaderSource,
        config.SHADING ? ['SHADING'] : undefined
      )!
    );

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    function getResolution(resolution: number) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
        return { width: max, height: min };
      }
      return { width: min, height: max };
    }

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA!;
      const rg = ext.formatRG!;
      const r = ext.formatR!;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);

      dye = dye
        ? resizeDoubleFBO(
            dye,
            dyeRes.width,
            dyeRes.height,
            rgba.internalFormat,
            rgba.format,
            texType,
            filtering
          )
        : createDoubleFBO(
            dyeRes.width,
            dyeRes.height,
            rgba.internalFormat,
            rgba.format,
            texType,
            filtering
          );

      velocity = velocity
        ? resizeDoubleFBO(
            velocity,
            simRes.width,
            simRes.height,
            rg.internalFormat,
            rg.format,
            texType,
            filtering
          )
        : createDoubleFBO(
            simRes.width,
            simRes.height,
            rg.internalFormat,
            rg.format,
            texType,
            filtering
          );

      divergence = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      curl = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
    }

    // ---- Simulation loop ------------------------------------------------

    let lastUpdateTime = Date.now();

    function calcDeltaTime() {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }

    function resizeCanvas() {
      const width = Math.floor(canvas!.clientWidth * window.devicePixelRatio);
      const height = Math.floor(canvas!.clientHeight * window.devicePixelRatio);
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        return true;
      }
      return false;
    }

    function step(dt: number) {
      gl.disable(gl.BLEND);

      curlProgram.bind();
      gl.uniform2f(
        curlProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(
        divergenceProgram.uniforms.uVelocity,
        velocity.read.attach(0)
      );
      blit(divergence);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(
        pressureProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(
          pressureProgram.uniforms.uPressure,
          pressure.read.attach(1)
        );
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl.uniform2f(
        gradientSubtractProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl.uniform1i(
        gradientSubtractProgram.uniforms.uPressure,
        pressure.read.attach(0)
      );
      gl.uniform1i(
        gradientSubtractProgram.uniforms.uVelocity,
        velocity.read.attach(1)
      );
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(
        advectionProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      if (!ext.supportLinearFiltering) {
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      const velId = velocity.read.attach(0);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velId);
      gl.uniform1i(advectionProgram.uniforms.uSource, velId);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.VELOCITY_DISSIPATION
      );
      blit(velocity.write);
      velocity.swap();

      if (!ext.supportLinearFiltering) {
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          dye.texelSizeX,
          dye.texelSizeY
        );
      }
      gl.uniform1i(
        advectionProgram.uniforms.uVelocity,
        velocity.read.attach(0)
      );
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.DENSITY_DISSIPATION
      );
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl.disable(gl.BLEND);
      displayProgram.bind();
      gl.uniform2f(
        displayProgram.uniforms.texelSize,
        1.0 / gl.drawingBufferWidth,
        1.0 / gl.drawingBufferHeight
      );
      gl.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    // ---- Splats (input) -------------------------------------------------

    function correctRadius(radius: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio > 1) return radius * aspectRatio;
      return radius;
    }

    function splat(
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: { r: number; g: number; b: number }
    ) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(
        splatProgram.uniforms.aspectRatio,
        canvas!.width / canvas!.height
      );
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(
        splatProgram.uniforms.radius,
        correctRadius(config.SPLAT_RADIUS / 100.0)
      );
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function splatPointer(pointer: Pointer) {
      const dx = pointer.deltaX * config.SPLAT_FORCE;
      const dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    // Emit a soft, upward-drifting burst at a random spot along the lower half
    // of the canvas so an idle band still has smoke rising through it.
    function ambientSplat() {
      const x = Math.random();
      const y = Math.random() * 0.4;
      const dx = (Math.random() - 0.5) * 1000;
      const dy = 800 + Math.random() * 800;
      splat(x, y, dx, dy, brandColor());
    }

    function correctDeltaX(delta: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio < 1) return delta * aspectRatio;
      return delta;
    }

    function correctDeltaY(delta: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio > 1) return delta / aspectRatio;
      return delta;
    }

    // Bias the palette toward warm Statix tones (orange/amber) with the
    // occasional ember flicker so the trail reads as glowing smoke.
    function brandColor() {
      const hue = 0.03 + Math.random() * 0.06; // ~11°–32°, orange band
      const c = HSVtoRGB(hue, 0.85, 1.0);
      c.r *= 0.32;
      c.g *= 0.32;
      c.b *= 0.32;
      return c;
    }

    function HSVtoRGB(h: number, s: number, v: number) {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      let r = 0;
      let g = 0;
      let b = 0;
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
      return { r, g, b };
    }

    function updatePointerDownData(
      pointer: Pointer,
      id: number,
      posX: number,
      posY: number
    ) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = brandColor();
    }

    function updatePointerMoveData(
      pointer: Pointer,
      posX: number,
      posY: number,
      color: { r: number; g: number; b: number }
    ) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved =
        Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    }

    function updatePointerUpData(pointer: Pointer) {
      pointer.down = false;
    }

    // ---- Event handlers -------------------------------------------------
    //
    // Coordinates are resolved relative to the canvas rect so the simulation
    // lines up with a section anywhere on the page (not just a full-screen
    // overlay). Points outside the canvas simply fall out of [0,1] range and
    // contribute nothing visible.

    const scaleByPixelRatio = (input: number) =>
      Math.floor(input * (window.devicePixelRatio || 1));

    function getCanvasPos(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: scaleByPixelRatio(clientX - rect.left),
        y: scaleByPixelRatio(clientY - rect.top),
      };
    }

    const handleMouseDown = (e: MouseEvent) => {
      const pointer = pointers[0];
      const { x, y } = getCanvasPos(e.clientX, e.clientY);
      updatePointerDownData(pointer, -1, x, y);
      splatPointer(pointer);
    };

    const handleFirstMouseMove = (e: MouseEvent) => {
      const pointer = pointers[0];
      const { x, y } = getCanvasPos(e.clientX, e.clientY);
      const color = brandColor();
      updateFirstMove(pointer, x, y, color);
      window.removeEventListener('mousemove', handleFirstMouseMove);
      window.addEventListener('mousemove', handleMouseMove);
    };

    function updateFirstMove(
      pointer: Pointer,
      posX: number,
      posY: number,
      color: { r: number; g: number; b: number }
    ) {
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.color = color;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const pointer = pointers[0];
      const { x, y } = getCanvasPos(e.clientX, e.clientY);
      updatePointerMoveData(pointer, x, y, pointer.color);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touches = e.targetTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        const { x, y } = getCanvasPos(touches[i].clientX, touches[i].clientY);
        updatePointerDownData(pointer, touches[i].identifier, x, y);
        splatPointer(pointer);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touches = e.targetTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        const { x, y } = getCanvasPos(touches[i].clientX, touches[i].clientY);
        updatePointerMoveData(pointer, x, y, pointer.color);
      }
    };

    const handleTouchEnd = () => {
      updatePointerUpData(pointers[0]);
    };

    // ---- Boot -----------------------------------------------------------

    resizeCanvas();
    initFramebuffers();

    // Seed the canvas with a few bursts so smoke is already present on load.
    for (let i = 0; i < 6; i++) ambientSplat();

    let animationId = 0;
    let lastAmbientTime = Date.now();
    let visible = true;

    function updateFrame() {
      const dt = calcDeltaTime();
      if (resizeCanvas()) initFramebuffers();
      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      });
      if (Date.now() - lastAmbientTime > config.AMBIENT_INTERVAL) {
        lastAmbientTime = Date.now();
        ambientSplat();
      }
      step(dt);
      render();
      // Only keep the loop alive while the band is on screen.
      animationId = visible ? requestAnimationFrame(updateFrame) : 0;
    }

    // Pause the simulation entirely when the section scrolls out of view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && animationId === 0) {
          lastUpdateTime = Date.now();
          lastAmbientTime = Date.now();
          animationId = requestAnimationFrame(updateFrame);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    lastUpdateTime = Date.now();
    updateFrame();

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleFirstMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleFirstMouseMove);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      const loseContext = gl.getExtension('WEBGL_lose_context');
      loseContext?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 h-full w-full'
    />
  );
}

// ---- WebGL context bootstrap (module scope) ---------------------------

function getWebGLContext(canvas: HTMLCanvasElement): GLContext | null {
  const params: WebGLContextAttributes = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  let gl: WebGL2RenderingContext | WebGLRenderingContext | null =
    canvas.getContext('webgl2', params) as WebGL2RenderingContext | null;
  const isWebGL2 = !!gl;
  if (!gl) {
    gl = (canvas.getContext('webgl', params) ||
      canvas.getContext(
        'experimental-webgl',
        params
      )) as WebGLRenderingContext | null;
  }
  if (!gl) return null;

  let halfFloat: OES_texture_half_float | null = null;
  let supportLinearFiltering: OES_texture_half_float_linear | null = null;
  if (isWebGL2) {
    (gl as WebGL2RenderingContext).getExtension('EXT_color_buffer_float');
    supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float');
    supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const halfFloatTexType = isWebGL2
    ? (gl as WebGL2RenderingContext).HALF_FLOAT
    : halfFloat?.HALF_FLOAT_OES ?? 0;

  let formatRGBA;
  let formatRG;
  let formatR;

  if (isWebGL2) {
    const gl2 = gl as WebGL2RenderingContext;
    formatRGBA = getSupportedFormat(
      gl2,
      gl2.RGBA16F,
      gl2.RGBA,
      halfFloatTexType
    );
    formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType);
    formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType);
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  }

  return {
    gl,
    ext: {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering,
    },
  };
}

function getSupportedFormat(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  internalFormat: number,
  format: number,
  type: number
): { internalFormat: number; format: number } | null {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    if ('R16F' in gl) {
      const gl2 = gl as WebGL2RenderingContext;
      switch (internalFormat) {
        case gl2.R16F:
          return getSupportedFormat(gl2, gl2.RG16F, gl2.RG, type);
        case gl2.RG16F:
          return getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, type);
        default:
          return null;
      }
    }
    return null;
  }
  return { internalFormat, format };
}

function supportRenderTextureFormat(
  gl: WebGL2RenderingContext | WebGLRenderingContext,
  internalFormat: number,
  format: number,
  type: number
): boolean {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  return status === gl.FRAMEBUFFER_COMPLETE;
}
