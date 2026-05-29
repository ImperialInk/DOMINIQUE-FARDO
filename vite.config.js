import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        the_show: 'the_show.html',
        testimonials: 'testimonials.html',
        de_index: 'de/index.html',
        de_about: 'de/about.html',
        de_the_show: 'de/the_show.html',
        de_testimonials: 'de/testimonials.html',
        fr_index: 'fr/index.html',
        fr_about: 'fr/about.html',
        fr_the_show: 'fr/the_show.html',
        fr_testimonials: 'fr/testimonials.html',
        it_index: 'it/index.html',
        it_about: 'it/about.html',
        it_the_show: 'it/the_show.html',
        it_testimonials: 'it/testimonials.html',
        ko_index: 'ko/index.html',
        ko_about: 'ko/about.html',
        ko_the_show: 'ko/the_show.html',
        ko_testimonials: 'ko/testimonials.html',
      },
    },
  },
});
