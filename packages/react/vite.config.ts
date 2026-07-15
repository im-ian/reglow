import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [/^react(?:\/.*)?$/, /^@reglow\/elements(?:\/.*)?$/],
    },
    minify: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
