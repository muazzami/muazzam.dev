// @ts-check
import { defineConfig } from 'astro/config';

/**
 * The deliverable is a plain static HTML/CSS/JS site.
 * Astro is a build tool only — nothing about it may appear in `dist/`.
 *
 * Every option below exists to keep the output readable and build-system-free:
 *   compressHTML:false      → indented, human-readable HTML
 *   inlineStylesheets:never → CSS always lands in a real .css file, never a <style> blob
 *   assets:'assets'         → asset dir is `assets/`, not Astro's default `_astro/`
 *   minify:false            → readable JS
 *   cssMinify:false         → readable CSS
 *   *FileNames              → stable names, no content hashes
 */
export default defineConfig({
  compressHTML: false,

  build: {
    format: 'directory',      // /about/index.html → clean URLs on any host
    inlineStylesheets: 'never',
    assets: 'assets',
  },

  vite: {
    build: {
      cssCodeSplit: false,
      minify: false,
      cssMinify: false,
      rollupOptions: {
        output: {
          // Astro names its virtual modules `<page>@_@astro`, which leaks the
          // build system into the emitted filename. Strip it.
          assetFileNames: (info) => {
            const source = info.names?.[0] ?? info.originalFileNames?.[0] ?? 'asset';
            const dot = source.lastIndexOf('.');
            const ext = dot > 0 ? source.slice(dot) : '';
            let base = (dot > 0 ? source.slice(0, dot) : source)
              .replace(/@_@astro$/, '')
              .replace(/[^a-zA-Z0-9._-]/g, '-');
            // One stylesheet for the whole site. Splitting saves nothing here
            // (all CSS is 26KB gzipped).
            if (ext === '.css') return 'assets/css/main.css';
            return `assets/${base || 'asset'}${ext}`;
          },
          // No entry/chunk naming: this site ships no bundled JS (scripts live
          // in public/assets/js), and renaming chunks leaks Astro's server
          // chunks into dist/.
        },
      },
    },
  },
});
