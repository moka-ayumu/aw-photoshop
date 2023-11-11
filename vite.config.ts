import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnoCSS from 'unocss/vite';
import extractorSvelte from '@unocss/extractor-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS({
      extractors: [extractorSvelte()],
    }),
    svelte(),
  ],
  build: {
    rollupOptions: {
      external: ['uxp', 'photoshop'],
    },
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['cjs'],
      fileName() {
        return 'main.js';
      },
    },
  },
});
