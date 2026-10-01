// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 正式網址：canonical、sitemap、Open Graph 都以此為準
export default defineConfig({
  site: 'https://smartguard-site.vercel.app',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
