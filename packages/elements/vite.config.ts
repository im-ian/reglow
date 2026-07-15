import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ rollupTypes: false })],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        register: resolve(import.meta.dirname, 'src/register.ts'),
        manifest: resolve(import.meta.dirname, 'src/manifest.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
