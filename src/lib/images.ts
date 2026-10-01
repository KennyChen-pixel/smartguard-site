import type { ImageMetadata } from 'astro';

// content/*.json 裡的 image 欄位填檔名，這裡對應到 src/assets/images/ 的實際圖片
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
});

export function getImage(name: string): ImageMetadata {
  const hit = files[`/src/assets/images/${name}`];
  if (!hit) {
    const available = Object.keys(files).map((k) => k.split('/').pop()).join('、');
    throw new Error(`找不到圖片「${name}」。請把檔案放進 src/assets/images/。目前有：${available}`);
  }
  return hit.default;
}

export function hasImage(name?: string): name is string {
  return !!name && !!files[`/src/assets/images/${name}`];
}
