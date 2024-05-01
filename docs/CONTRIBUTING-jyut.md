# 貢獻指南

[English](CONTRIBUTING.md) | [官话 - 简体中文](CONTRIBUTING-cmn_CN.md) | [官話 - 正體中文](CONTRIBUTING-cmn_TW.md) | [廣東話](CONTRIBUTING-jyut.md)

## 💻 設定開發環境

呢份專案係用咗 [Vite](https://vitejs.dev/) 建立，請確保你已經單咗 [Node.js](https://nodejs.org/) 同 [pnpm](https://pnpm.io/)，建議用 [Visual Studio Code](https://code.visualstudio.com/) 進行開發。

## 🔧 開發同建置專案

### 開發（Chrome 或 Edge）

1. 執行 pnpm 指令

```bash
# 安裝依賴
pnpm install

# 運行專案
pnpm dev
```

2. 喺 Chrome 入邊打開 `chrome://extensions` 頁面抑或喺 Edge 度打開 `edge://extensions` 頁面

3. 打開`開發者模式`，撳`載入解壓縮`

<img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
<br/>
<img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/232246901-e3544c16-bde2-480d-b770-ca5242793963.png">

4. 喺瀏覽器度載入產生嘅 `extension/` 資料夾

每一次執過 code 之後，你都要撳 [Extensions Reloader](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) 粒掣，然之後 refresh 個 page，確保係有效果。

#### 建立（Chrome 或 Edge）

建置延新功能，要執行下底嘅指令

```bash
pnpm build
```

然之後打包 `extension` 下嘅檔案

### 開發（Firefox）

1. 執行 pnpm 指令

```bash
# 安裝依賴
pnpm install

# 運行專案
pnpm dev
```

2. 喺瀏覽器度輸入 `about:addons`，撳 `Extensions` 然之後 `Debug Add-ons`

<img width="655" alt="image" src="https://github.com/hakadao/BewlyBewly/assets/33394391/7c49e4ca-2a87-4c56-bc00-3259d6eba128">

3. 喺瀏覽器度載入產生嘅 `extension-firefox/` 資料夾

#### 建立（Firefox）

建置延新功能，要執行下底嘅指令

```bash
pnpm build-firefox
```

然之後打包 `extension-firefox` 下嘅檔案

## 🤝 貢獻

### 關於分支

#### 永久分支

- **Dev**：用呢個分支進行執 bug、新功能嘅開發、改進效能抑或執語系檔（i18n）。
- **Main**：主分支，代表穩定同可以發布嘅版本。

#### 其他臨時分支

- **feat/**：提交新功能嘅分支
- **doc/**：專門愛嚟執文檔，無功能變動嘅分支。
- **fix/**：專門愛嚟執 dev 分支上嘅 bug。

### 提交慣例

- `feat`：新功能
- `fix`：執 bugs
- `docs`：文檔更新
- `style`：執樣式
- `refactor`：代碼重構
- `test`：新增或更新測試
- `chore`：對建設過程或工具鏈進行更改
- `perf`：效能改進
- `ci`：持續集成/交付更改
歡迎添加範疇同腳註
例如：
`fix(dock)：xxx`
`變更描述`
`相關 PR：url`

### i18n

- 喺翻譯嗰陣，若然你遇到一種你唔熟嘅語言，你可以用第種識翻譯嘅語言來翻譯，兼且喺 PR 講明你唔識譯邊種語言。
- **請手動維護 i18n 國際化語系檔！！！** 請勿使用 `i18n Ally` 抑或其他擴充套件維護。 我知你可能唔係幾明，抑或可能唔鍾意咁樣，但係用 `i18n Ally` 進行維護之後，你唔之你翻譯咗嘅內容擺喺邊處，或剷咗程式碼註解。
