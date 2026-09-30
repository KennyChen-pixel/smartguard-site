# 智感先鋒科技 官網（smartguard-site）

公司官網：智感先鋒科技 SmartGuard Tech。產品正式名稱永遠是「**SmartGuard 智慧主動式防跌偵測系統**」（不要寫成 SmartShoe 或其他名稱）。

- 正式網址：https://smartguard-site.vercel.app（canonical、sitemap、OG 都以此為準，設定在 `astro.config.mjs` 與 `content/site.json`）
- GitHub：https://github.com/KennyChen-pixel/smartguard-site
- 部署：Vercel（team `smartguard-web`，專案 `smartguard-site`）。push 到 `main` = 直接上線；push 其他分支 = 產生 Preview 網址。

## 技術棧

- **Astro 7**（靜態輸出，每頁都是獨立 HTML）＋ 原生 TypeScript（無 React、無 Tailwind）
- 樣式：`src/styles/tokens.css`（設計 tokens）＋ `global.css` ＋ 各元件內 `<style>`
- 圖片：`astro:assets` 自動轉 WebP、產生多種尺寸
- 表單：Web3Forms（金鑰在環境變數 `PUBLIC_WEB3FORMS_KEY`，本機放 `.env`，Vercel 在 Settings → Environment Variables）
- Node 24、npm

## 常用指令

```bash
npm install          # 安裝
npm run dev          # 本機開發 http://localhost:4321
npm run check        # 型別檢查 + 內容檔檢查（content/*.json）
npm run build        # 建置到 dist/
npm run preview      # 預覽建置結果
```

在 Windows 上若 `git`、`vercel` 不在 PATH，用完整路徑：`"C:\Program Files\Git\cmd\git.exe"`、`"$env:APPDATA\npm\vercel.cmd"`。

## 內容在哪裡改（網站文字 99% 只需要改這裡）

所有可變內容都在 `content/*.json`，頁面只負責讀取顯示。每個檔案開頭的 `_說明` 欄位寫了用法。

| 想改的內容 | 檔案 | 說明 |
|---|---|---|
| 公司名稱、Email、電話、地址、LinkedIn、導覽列 | `content/site.json` | 全站共用（頁首、頁尾、聯絡頁、結構化資料） |
| 首頁主標題、副標、按鈕、信任數據列、首頁各區導讀、底部 CTA | `content/home.json` | `hero`、`trust`、`techIntro`、`cta` |
| 產品特點、產品圖、規格表 | `content/product.json` | `features`、`gallery`、`specs` |
| 常見問題 | `content/faq.json` | 顯示在產品頁 |
| 技術原理、「距離感測 ≠ 傳統 IMU」、運作流程 | `content/technology.json` | |
| 關於我們、團隊照片、成員、合作夥伴 | `content/team.json` | |
| 最新消息與榮譽 | `content/news.json` | 首頁自動顯示最上面 3 則 |
| 聯絡頁文字、表單需求類別 | `content/contact.json` | |
| 各頁 `<title>` 與 description | 各檔案的 `seo` 欄位 | title ≤ 60 字、description ≤ 160 字 |

### 常見操作

**新增一則最新消息**：在 `content/news.json` 的 `items` **最上方**加一筆：

```json
{ "date": "2026/10/15", "title": "消息標題", "icon": "Award", "url": "https://新聞連結" }
```

- `icon` 只能用：`Radio`（展會/活動）、`Award`（獲獎/入選）、`FileBadge`（專利/認證）、`Medal`（獎牌）
- 沒有連結時 `url` 填 `""`

**新增產品特點**：`content/product.json` → `features` 加一筆 `{ "title", "description", "icon" }`（icon 另可用 `Shield`、`Cpu`、`Eye`、`HeartHandshake`）。

**粗體**：內容文字中用 `**文字**` 會變粗體；其他 HTML 一律不支援（會被跳脫）。

**TODO 占位**：內容含「TODO」的區塊會以橘色虛線框醒目顯示，`npm run check` 也會列出所有待補項目。補完內容把 TODO 字樣拿掉即可。

## 圖片規範

- 放在 `src/assets/images/`，JSON 裡只填**檔名**（例：`"image": "team.jpg"`）
- 檔名：小寫英文、數字、連字號，例如 `medical-taiwan-2026-booth.jpg`（不要用中文或空白）
- 原始檔建議長邊 ≤ 2000px、單檔 ≤ 1 MB；建置時會自動轉 WebP 與多尺寸，不需手動壓縮成 WebP
- 去背產品圖用 PNG；照片用 JPG
- 每張圖都要有 `alt`（描述圖片內容的繁體中文）
- `public/` 內的圖片不會被最佳化，只放 favicon、`og.png` 這類必須固定網址的檔案

## 文案語氣

- 繁體中文（台灣用語）、專業溫和；讀者包含長輩、家屬、照護機構與合作夥伴
- **首頁與既有文案是公司親自撰寫的，未經同意不要改寫**；只做被要求的修改
- 不可編造數據、認證、合作單位、獎項或客戶。不確定就留 `TODO：` 占位並回報
- 數據要有出處（例：92% 來源為「高雄市鼓山區日照中心訪談」）
- 產品名稱固定：「SmartGuard 智慧主動式防跌偵測系統」

## 不要隨意修改的檔案（設計系統與核心元件）

改網站內容時，**不需要也不應該**動這些檔案；如需改版請先與負責人確認：

- `src/styles/tokens.css`、`src/styles/global.css`（色彩、字體、間距；文字色皆通過 WCAG AA）
- `src/layouts/BaseLayout.astro`、`src/components/Seo.astro`（SEO、結構化資料）
- `src/components/Hero.astro`、`src/scripts/hero-scene.ts`（首頁主視覺動畫）
- `src/components/Header.astro`、`Footer.astro`、`Icon.astro`
- `astro.config.mjs`、`vercel.json`
- `legacy/`：舊版 React 網站備份，不參與建置

## 安全規則

- `.env`、任何金鑰或 token **絕不進 git**（已在 `.gitignore`）；不要在輸出中顯示其值
- 內部文件（`.pptx`、`.pdf`）不進 git
- 不要 `git push --force`、不要改寫歷史
- 只 `git add` 本次修改的檔案，不要 `git add -A`
- 上線（merge 到 main）前一定要取得負責人明確同意

## 更新流程

一律使用 `/update-site <描述>`（見 `.claude/commands/update-site.md`）：改內容 → 檢查與建置 → 截圖確認 → 開分支 push → 給 Preview 連結 → 負責人說「上線」才 merge 到 `main`。
