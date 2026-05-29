import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        the_show: resolve(__dirname, 'the_show.html'),
        testimonials: resolve(__dirname, 'testimonials.html'),
        de_index: resolve(__dirname, 'de/index.html'),
        de_about: resolve(__dirname, 'de/about.html'),
        de_the_show: resolve(__dirname, 'de/the_show.html'),
        de_testimonials: resolve(__dirname, 'de/testimonials.html'),
        fr_index: resolve(__dirname, 'fr/index.html'),
        fr_about: resolve(__dirname, 'fr/about.html'),
        fr_the_show: resolve(__dirname, 'fr/the_show.html'),
        fr_testimonials: resolve(__dirname, 'fr/testimonials.html'),
        it_index: resolve(__dirname, 'it/index.html'),
        it_about: resolve(__dirname, 'it/about.html'),
        it_the_show: resolve(__dirname, 'it/the_show.html'),
        it_testimonials: resolve(__dirname, 'it/testimonials.html'),
        ko_index: resolve(__dirname, 'ko/index.html'),
        ko_about: resolve(__dirname, 'ko/about.html'),
        ko_the_show: resolve(__dirname, 'ko/the_show.html'),
        ko_testimonials: resolve(__dirname, 'ko/testimonials.html'),
      },
    },
  },
});
