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
| 產品頁主圖、產品特點 | `content/product.json` | `heroImage`、`features`（規格表與產品圖庫已依負責人要求移除） |
| 常見問題 | `content/faq.json` | 顯示在產品頁，並自動輸出 FAQPage 結構化資料 |
| 技術原理、「距離感測 ≠ 傳統 IMU」、運作流程 | `content/technology.json` | 運作流程目前隱藏：`flow.show: false` |
| 關於我們、團隊照片、成員、合作夥伴 | `content/team.json` | 合作夥伴目前隱藏：`showPartners: false` |
| 最新消息與榮譽 | `content/news.json` | 首頁自動顯示最上面 3 則 |
| 聯絡頁文字、表單需求類別 | `content/contact.json` | |
| 各頁 `<title>` 與 description | 各檔案的 `seo` 欄位 | title ≤ 60 字、description ≤ 160 字 |

### 顯示開關（隱藏但保留內容）

| 區塊 | 開關 | 目前 |
|---|---|---|
| 技術頁「HOW IT WORKS」運作流程 | `technology.json` → `flow.show` | `false`（內容仍是 TODO） |
| 團隊頁合作夥伴 | `team.json` → `showPartners` | `false`（內容仍是 TODO） |
| FAQ 附加句（例：視障者使用情境） | `faq.json` → 該題 `extra.show` | `false`（未驗證，不可公開） |

開關設為 `false` 時，該區塊不會出現在網頁原始碼、也不會寫入結構化資料。以 `_` 開頭的欄位（如 `_待確認`、`_待補`）是內部備註，不會顯示。

### 常見操作

**新增一則最新消息**：在 `content/news.json` 的 `items` **最上方**加一筆：

```json
{ "date": "2026/10/15", "title": "消息標題", "icon": "Award", "url": "https://新聞連結" }
```

- `icon` 只能用：`Radio`（展會/活動）、`Award`（獲獎/入選）、`FileBadge`（專利/認證）、`Medal`（獎牌）
- 沒有連結時 `url` 填 `""`

**團隊成員**：`content/team.json` → `members`，每位 `{ name, role, photo }`（只顯示姓名與職稱）。照片放 `src/assets/images/`（直式 4:5、檔名如 `team-姓名拼音.jpg`），沒有照片時 `photo` 留空，會顯示姓氏字首。

**更新產品主圖**（產品頁右側的去背產品圖）：新圖放 `src/assets/images/`（去背 PNG），改 `content/product.json` → `heroImage.image` 為新檔名、`heroImage.alt` 為描述；感測模組標註點位置在 `src/pages/product.astro` 的 `.hotspot`（換圖後需對位）。首頁主視覺的鞋子圖是 `product-render-2.png`，對位參數在 `hero-scene.ts`（感測模組位於圖片 352,88／554,248），換圖需重新對位，屬設計變更須先確認。

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

## 🔒 網址與 Search Console 驗證（任何改版都不可更動）

- 正式網址固定為 `https://smartguard-site.vercel.app`，與 Google Search Console 資源一致（已驗證，含 2026/6/29 起的成效資料）。
- 各頁網址固定：`/`、`/product`、`/technology`、`/team`、`/news`、`/contact`。不可改名、不可加 `.html` 或結尾斜線。
- **驗證檔 `public/google76491f48d04be451.html` 絕對不可刪除、改名或修改內容**，且必須能以原網址直接回應 200（不可被轉址）。
- 因此 `vercel.json` 維持 `"cleanUrls": false`、`astro.config.mjs` 維持 `build.format: 'directory'`；開啟 cleanUrls 會讓驗證檔被 308 轉址，可能導致 Search Console 驗證失效。
- sitemap：`/sitemap-index.xml`（建置自動產生）；`/sitemap.xml` 為相容舊網址的索引檔；`robots.txt` 指向 sitemap-index.xml。

## 不要隨意修改的檔案（設計系統與核心元件）

改網站內容時，**不需要也不應該**動這些檔案；如需改版請先與負責人確認：

- `src/styles/tokens.css`、`src/styles/global.css`（色彩、字體、間距；文字色皆通過 WCAG AA）
- `src/layouts/BaseLayout.astro`、`src/components/Seo.astro`（SEO、結構化資料）
- `src/components/Hero.astro`、`src/scripts/hero-scene.ts`（首頁主視覺：聲波感測動畫與心電圖）
- `src/components/Header.astro`、`Footer.astro`、`Icon.astro`
- `astro.config.mjs`、`vercel.json`（網址與驗證相關，見上方 🔒 區塊）
- `public/google76491f48d04be451.html`（Search Console 驗證檔）
- `legacy/`：舊版 React 網站備份，不參與建置

## 安全規則

- `.env`、任何金鑰或 token **絕不進 git**（已在 `.gitignore`）；不要在輸出中顯示其值
- 內部文件（`.pptx`、`.pdf`）不進 git
- 不要 `git push --force`、不要改寫歷史
- 只 `git add` 本次修改的檔案，不要 `git add -A`
- 上線（merge 到 main）前一定要取得負責人明確同意

## 更新流程

一律使用 `/update-site <描述>`（見 `.claude/commands/update-site.md`）：改內容 → 檢查與建置 → 截圖確認 → 開分支 push → 給 Preview 連結 → 負責人說「上線」才 merge 到 `main`。

- 負責人通常用 iPhone 看預覽；Preview 網址有 Vercel 部署保護，需登入 Vercel 帳號才看得到（不要為了測試去建立 protection bypass 金鑰）。
- Preview 網址格式：`https://smartguard-site-git-<分支名，/ 換成 ->-smartguard-web.vercel.app`
- 上線後要實測正式網址：各頁 200、`/google76491f48d04be451.html` 直接 200（不可轉址）、canonical 為乾淨網址。
- 改到首頁主視覺時，須驗收首屏：桌機 1536×730、1366×650、1440×780、1920×950；手機 390×844、390×664、375×667；平板 768×1024。

## 專案歷程與現況（給下一次的 Claude）

> 舊檔 `HANDOFF.md`、`移交須注意事項.png` 是 2026/8 舊 React 版的交接筆記，**內容已過時**，以本檔為準。

**2026-09-30 ～ 10-01 改版（已上線，main）**
- 由 Vite + React 單頁改為 Astro 7 靜態多頁；舊程式碼保留在 `legacy/`。
- 設計：醫療方格紙 × 3D 點陣地面；首頁主視覺為「長輩行走 → 感測聲波碰到門檻產生回波 → 震動預警 → 放慢 → 已於跌倒前預警」，底部步態訊號的偵測標記與動畫同一時間軸。配色取自 LOGO（天青 #4fc0e1 × 薄荷 #66c2ae）。
- 首屏：768px 以上依視窗高度自適應（`hero-scene.ts` 的 `fitScene` 依可用高度計算透視）；767px 以下為一般垂直排列，場景是按鈕下方的獨立區塊。
- 手機效能：點陣同排合併繪製（每格約 4.5ms）、畫面外暫停、觸控裝置不用 backdrop-filter／混色／模糊。
- 內容：文案沿用公司原文；已依第三方審查移除無法佐證的用詞、加醫療免責聲明、正式公司名稱「智感先鋒科技有限公司」。團隊顯示：陳璟 Kenny（Founder & CTO）、蕭喻心 Aysel（Founder & CEO）、范哲銓（COO，暫無照片、不加英文名）。
- Lighthouse 行動版：Performance ≥ 91、Accessibility／Best Practices／SEO 100。

**負責人尚未決定 / 待提供**（不要自行修改，等負責人回覆）
- 首頁眉標「AI 驅動主動防跌技術」是否保留（AI 個人化屬第二代研發中）
- 「92% 受測長者安心感提升」是否補樣本數與時間
- 產品頁是否註明「第一代產品試產中」
- 范哲銓個人照；Medical Taiwan 新聞的新連結（原連結 404，目前不放連結）
- 隱私權政策頁、公司網域信箱、自訂網域、Vercel 升級 Pro、GitHub App（手機留言 @claude 更新）

**產品事實（僅供理解，未經同意不要搬上網站）**：依 2026 U-start 營運計畫簡報 v5，感測為 VL53L0X 雷射測距＋六軸 IMU；接近障礙未減速時以震動＋提示音預警；以魔鬼氈外加於長輩原本的鞋上。簡報檔不在 git 中（`*.pptx` 已排除）。

**這台電腦的環境**：git 與 Vercel CLI 不在 PATH，用完整路徑（見「常用指令」）。Vercel CLI 已登入；GitHub 憑證存於 Windows 認證管理員，可直接 push。Claude Code 環境中 `GCM_INTERACTIVE=never`，若需重新登入 GitHub，請負責人執行 `! $env:GCM_INTERACTIVE='auto'; $env:GIT_TERMINAL_PROMPT='1'; git push`。
