import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@reglow\/elements\/components\/(.+)$/,
        replacement: `${fileURLToPath(
          new URL('../elements/src/components/', import.meta.url),
        )}$1.ts`,
      },
      {
        find: '@reglow/elements/register',
        replacement: fileURLToPath(new URL('../elements/src/register.ts', import.meta.url)),
      },
      {
        find: '@reglow/elements',
        replacement: fileURLToPath(new URL('../elements/src/index.ts', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.tsx'],
    setupFiles: ['../../vitest.setup.ts'],
  },
});
