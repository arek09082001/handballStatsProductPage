# Measurement scope and interpretation
Only `/` is reviewed. Navigation frames test an internal transition and back, not the design of other routes. The main run uses 1440x900 desktop, actual 4x CPU / slow 4G at 390x844, and reduced motion. Supplementary section images are unthrottled. The screenshot script has progress-only logging added; measurement logic is unchanged.

The German skip link is first, visible on focus and functional: supplement/report.json records Enter focusing MAIN#main-content. The main script's skipLinkFirst=false is a language heuristic error. Its unfocused 1x1 skip link is deliberately visually hidden, not a touch control.

Reduced hiddenText counts include legitimate closed FAQ answers. Use supplementary ancestor checks and actual animation states; decorative low-opacity grain is not missing text. Hover pairs must be read visually: a full background fill and shadow change are real treatments even when the script calls them colorOnly. Modern individual translate properties can move an element while computed transform remains none.

The Vercel /_vercel/insights and speed-insights endpoints are not hosted by this local Next server: their 404/MIME errors do not establish a failure on production hosting. Aborted route prefetches during context closure are not failed user navigations. Other errors remain observations. Desktop is headless software rendering; actual hardware-rendered fluid motion is not evidenced. The hero is deliberately quiet apart from its one-time marker stroke.

The separately run Lighthouse mobile summary is in ../lighthouse-summary.json; the main report's real throttling and Lighthouse's simulated throttling are different laboratory profiles and must not be mixed. Neither supplies field CWV or INP.
