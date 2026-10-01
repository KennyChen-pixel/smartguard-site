// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 正式網址：canonical、sitemap、Open Graph 都以此為準（與 Search Console 資源一致，請勿更改）
// 頁面輸出為資料夾形式（/product/index.html），網址維持 /product；
// 不使用 Vercel cleanUrls，避免 Search Console 驗證檔 google76491f48d04be451.html 被轉址。
export default defineConfig({
  site: 'https://smartguard-site.vercel.app',
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
