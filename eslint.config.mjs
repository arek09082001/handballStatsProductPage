import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['scripts/**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    ignores: [
      'app/api/**', '.next/**', 'out/**', 'build/**', '.jury/**', '.claude/skills/**',
      'scripts/screenshots/livestream/regie/**',
      'scripts/screenshots/statistik/harness.tsx',
      'scripts/screenshots/sponsoren/harness.tsx',
      'scripts/screenshots/besprechung/harness.tsx',
    ],
  },
];

export default eslintConfig;
