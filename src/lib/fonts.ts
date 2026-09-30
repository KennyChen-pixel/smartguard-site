// 標題字體（Noto Serif TC）只下載網站實際用到的字：建置時從內容檔收集，
// 以 Google Fonts 的 text= 參數產生極小的子集字型檔。內文使用系統中文字體（不需下載）。
import site from '../../content/site.json';
import home from '../../content/home.json';
import product from '../../content/product.json';
import technology from '../../content/technology.json';
import team from '../../content/team.json';
import faq from '../../content/faq.json';
import contact from '../../content/contact.json';

// 元件中寫死、會用到標題字體的文字
const STATIC = '常見問題找不到這個頁面團隊成員合作夥伴「」，、。';
const ASCII = ' !%&()+,-./0123456789:?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz≠';

// 會以標題字體顯示的欄位名稱（內文段落用系統字體，不需收集）
const DISPLAY_KEYS = new Set(['title', 'subtitle', 'name', 'quote', 'highlight', 'value', 'brandLine', 'membersTitle', 'partnersTitle']);

function collect(v: unknown, out: string[], key = '') {
  if (typeof v === 'string') { if (DISPLAY_KEYS.has(key)) out.push(v); }
  else if (Array.isArray(v)) v.forEach((x) => collect(x, out, key));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => { if (!k.startsWith('_') && k !== 'seo' && k !== 'items') collect(x, out, k); });
}

export function displayFontUrl(): string {
  const strings: string[] = [STATIC, ASCII];
  collect([site, home, product, technology, team, contact], strings);
  strings.push(faq.title, ...team.members.map((m) => m.name.replace('TODO：', '').slice(0, 1)));
  const chars = [...new Set(strings.join(''))].filter((c) => c.trim() && !/[\u0000-\u001f]/.test(c)).sort().join('');
  return `https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700;900&display=swap&text=${encodeURIComponent(chars)}`;
}

export const MONO_FONT_URL = 'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;500&display=swap';
