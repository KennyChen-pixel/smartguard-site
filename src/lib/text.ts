// 內容檔只允許一種格式：**粗體**。其餘一律跳脫，避免內容檔插入 HTML。
export function richText(input: string): string {
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export const isTodo = (s?: string) => !!s && s.includes('TODO');
