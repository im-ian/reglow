import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    svelte({
      configFile: fileURLToPath(new URL('./packages/svelte/svelte.config.js', import.meta.url)),
    }),
  ],
  resolve: {
    conditions: ['browser'],
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
        find: '@reglow/svelte',
        replacement: fileURLToPath(new URL('./packages/svelte/src/index.ts', import.meta.url)),
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
    server: {
      deps: {
        inline: [/@testing-library\/svelte/],
      },
    },
    setupFiles: ['./vitest.setup.ts'],
  },
});
