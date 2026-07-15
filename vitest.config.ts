import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@reglow\/elements\/components\/(.+)$/,
        replacement: `${fileURLToPath(
          new URL('./packages/elements/src/components/', import.meta.url),
        )}$1.ts`,
      },
      {
        find: '@reglow/elements/register',
        replacement: fileURLToPath(new URL('./packages/elements/src/register.ts', import.meta.url)),
      },
      {
        find: '@reglow/elements',
        replacement: fileURLToPath(new URL('./packages/elements/src/index.ts', import.meta.url)),
      },
      {
        find: '@reglow/react',
        replacement: fileURLToPath(new URL('./packages/react/src/index.tsx', import.meta.url)),
      },
      {
        find: '@reglow/vue',
        replacement: fileURLToPath(new URL('./packages/vue/src/index.ts', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['packages/*/tests/**/*.test.{ts,tsx}', 'stories/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
