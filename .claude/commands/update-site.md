---
description: 用一句話更新官網內容：改內容檔 → 檢查建置 → 截圖 → 開分支 push → 給 Preview 連結 → 說「上線」才 merge
argument-hint: <要更新什麼，例如「新增一則消息：10/15 參加高雄醫療展」>
---

你要依照使用者的描述更新官網。全程用繁體中文回覆。先讀 `CLAUDE.md`。

使用者的需求：**$ARGUMENTS**

## 步驟

1. **確認起點**
   - `git status`：若有與本次無關的未 commit 修改，先列出來問使用者，不要混進本次 commit。
   - `git switch main && git pull --ff-only`，再建立分支 `content/<yyyymmdd>-<簡短英文描述>`（例：`content/20261015-news-kaohsiung-expo`）。

2. **判斷並修改內容檔**
   - 依 `CLAUDE.md` 的對照表判斷要改哪個 `content/*.json`；只改內容檔。若需求必須改到元件或樣式，先停下來說明原因並詢問。
   - 需要圖片時：請使用者提供圖檔，放進 `src/assets/images/`（依命名規範改名），JSON 只填檔名，並寫好 `alt`。
   - 沒有提供的資訊（日期、連結、數據等）**不要猜**，先問；若使用者要先上稿，就用 `TODO：` 占位。
   - 保留原有文案，只改被要求的部分。

3. **檢查與建置**
   - `npm run check`（型別＋內容檢查）與 `npm run build`，失敗就修到通過。
   - 回報 `npm run check` 列出的待補（TODO）項目。

4. **截圖確認**
   - `npm run preview`，用 Playwright 截受影響頁面的桌機（1280）與手機（375）版，網址加 `?t=5000` 讓動畫呈現完成狀態。
   - 自己檢查：文字是否正確、有無跑版、溢出、圖片是否顯示。把截圖給使用者看。

5. **Commit 與 push**
   - 只 `git add` 本次修改的檔案（不要 `git add -A`），確認沒有 `.env`、金鑰或內部文件。
   - Commit 訊息用繁體中文，例如：`內容：新增最新消息「參加 2026 高雄醫療展」`
   - `git push -u origin <分支名>`（絕不 force push）。

6. **Preview 連結**
   - 等 Vercel 建置完成：`vercel ls smartguard-site` 或 `vercel inspect`，取得此分支的 Preview 網址（狀態 Ready）。
   - 回覆使用者：修改摘要、Preview 連結、截圖、待補事項。然後**停下來等待**。

7. **上線（使用者明確說「上線」才做）**
   - `git switch main && git pull --ff-only && git merge --no-ff <分支名> -m "上線：<摘要>"`，`git push origin main`。
   - 等 Production 部署完成，確認 https://smartguard-site.vercel.app 已更新，回報結果。
   - 使用者若要求修改，回到步驟 2，在同一分支繼續。
