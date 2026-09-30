// 檢查 content/*.json：格式正確、必填欄位存在、圖片檔存在、連結格式正確。
// 執行：npm run check（也會在 /update-site 流程中自動執行）
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const errors = [];
const warnings = [];
const read = (f) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, 'content', f), 'utf8'));
  } catch (e) {
    errors.push(`content/${f}：JSON 格式錯誤（${e.message}）`);
    return null;
  }
};
const images = new Set(fs.readdirSync(path.join(root, 'src/assets/images')));
const ICONS = ['Radio', 'Shield', 'Cpu', 'Award', 'Medal', 'FileBadge', 'Eye', 'HeartHandshake'];
const need = (obj, keys, where) => keys.forEach((k) => { if (obj?.[k] === undefined || obj?.[k] === null) errors.push(`${where} 缺少欄位「${k}」`); });
const img = (name, where) => { if (name && !images.has(name)) errors.push(`${where} 的圖片「${name}」不在 src/assets/images/`); };
const url = (u, where) => { if (u && !/^(https?:\/\/|\/|mailto:|tel:)/.test(u)) errors.push(`${where} 的連結「${u}」格式不正確`); };
const todo = (v, where) => { if (typeof v === 'string' && v.includes('TODO')) warnings.push(`${where}：${v}`); };
const walkTodo = (obj, where) => {
  if (Array.isArray(obj)) obj.forEach((v, i) => walkTodo(v, `${where}[${i}]`));
  else if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => { if (!k.startsWith('_')) walkTodo(v, `${where}.${k}`); });
  else todo(obj, where);
};

const files = ['site.json', 'home.json', 'product.json', 'technology.json', 'team.json', 'news.json', 'faq.json', 'contact.json'];
const data = Object.fromEntries(files.map((f) => [f, read(f)]));

const news = data['news.json'];
if (news) {
  if (!Array.isArray(news.items) || !news.items.length) errors.push('news.json：items 必須是至少一筆的陣列');
  news.items?.forEach((n, i) => {
    const w = `news.json 第 ${i + 1} 則`;
    need(n, ['date', 'title', 'icon', 'url'], w);
    if (n.icon && !ICONS.includes(n.icon)) errors.push(`${w} 的 icon「${n.icon}」不存在，可用：${ICONS.join('、')}`);
    url(n.url, w);
  });
}
const product = data['product.json'];
if (product) {
  need(product, ['name', 'features'], 'product.json');
  product.features?.forEach((f, i) => { need(f, ['title', 'description', 'icon'], `product.json features[${i}]`); if (f.icon && !ICONS.includes(f.icon)) errors.push(`product.json features[${i}] 的 icon「${f.icon}」不存在`); });
  product.gallery?.forEach((g, i) => img(g.image, `product.json gallery[${i}]`));
  img(product.heroImage?.image, 'product.json heroImage');
}
const team = data['team.json'];
if (team) {
  img(team.photo?.image, 'team.json photo');
  team.members?.forEach((m, i) => img(m.photo, `team.json members[${i}]`));
}
const site = data['site.json'];
if (site) {
  need(site, ['name', 'contact', 'nav'], 'site.json');
  site.nav?.forEach((n) => url(n.href, `site.json nav「${n.label}」`));
}
for (const [f, d] of Object.entries(data)) {
  if (d?.seo) {
    if (d.seo.title?.length > 60) warnings.push(`${f} seo.title 超過 60 字，搜尋結果可能被截斷`);
    if (d.seo.description?.length > 160) warnings.push(`${f} seo.description 超過 160 字`);
  }
  if (d) walkTodo(d, f);
}

if (warnings.length) {
  console.log(`\n⚠ 待補內容 / 提醒（${warnings.length}）：`);
  warnings.forEach((w) => console.log('  - ' + w));
}
if (errors.length) {
  console.error(`\n✖ 內容檢查失敗（${errors.length}）：`);
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log('\n✔ 內容檢查通過');
