# BewlyBewly

[English](README.md) | [官话 - 简体中文](README-cmn_CN.md) | 官話 - 正體中文 | [廣東話](README-jyut.md)

<p align="center" style="margin-bottom: 0px !important;">
<img width="150" src="https://user-images.githubusercontent.com/33394391/160250512-410b71fc-7f25-4caf-b850-429227ff082a.png"><br/>
</p>

<h1 align="center" style="margin-top: 0px;">BewlyBewly</h1>

<p align="center">只需對您的 Bilibili 主頁進行一些小改動就好。</p>

![Image 3840x2400](https://github.com/hakadao/BewlyBewly/assets/33394391/ad726480-e6ef-4823-82e0-e3c3735a3909)
![Snipaste_2023-11-21_00-26-26](https://github.com/hakadao/BewlyBewly/assets/33394391/b1c1c25a-482a-438f-8e61-4d67cb32aea1)
![Snipaste_2023-11-21_00-30-03](https://github.com/hakadao/BewlyBewly/assets/33394391/1a9f0c56-5053-40d9-bec8-72665f85962d)
![Snipaste_2023-11-21_00-30-30](https://github.com/hakadao/BewlyBewly/assets/33394391/4cb44949-8352-4607-9dd4-74a8d1e00a74)
![Snipaste_2023-11-21_00-31-33](https://github.com/hakadao/BewlyBewly/assets/33394391/9ebebfd9-d8a8-411d-8c10-cf7cdb60abd4)
![Snipaste_2023-11-21_00-31-54](https://github.com/hakadao/BewlyBewly/assets/33394391/86ad5303-56b2-4d68-985d-300f2825ee49)
![Snipaste_2023-11-21_00-32-06](https://github.com/hakadao/BewlyBewly/assets/33394391/64b6eac1-d9ee-4157-a850-b940700a565b)
![Snipaste_2023-11-21_00-32-22](https://github.com/hakadao/BewlyBewly/assets/33394391/2533a1f9-3cb1-402e-96bb-3755404ddf02)
![Snipaste_2023-11-21_00-32-51](https://github.com/hakadao/BewlyBewly/assets/33394391/a439ea59-cc80-48aa-9c6a-ec5d4da98441)

## 👋 介紹

BewlyBewly 是一個針對 BiliBili 的瀏覽器擴充功能，旨在透過重新設計 BiliBili 的介面來提升用戶體驗。設計靈感來自於 YouTube、Vision OS 和 iOS，使介面更具視覺吸引力和用戶友好性。

該專案使用 [vitesse-webext](https://github.com/antfu/vitesse-webext) 範例進行開發。如果沒有此範例，可能無法開發出此專案。

## ⬇️ 安裝

### 線上安裝

即使您使用的是 Edge 瀏覽器，我們仍然強烈建議您從 Chrome 線上應用程式商店安裝。在審核速度上，Chrome 線上應用程式商店通常比 Edge 的附加元件來得快一些。

- Chrome: <https://chromewebstore.google.com/detail/bewlybewly/bbbiejemhfihiooipfcjmjmbfdmobobp>
- Edge: <https://microsoftedge.microsoft.com/addons/detail/bewlybewly/kceadhehfjdiakpiphpjgolbgehjdmja>
- Firefox: **我需要幫助!!!!!!!!!!!!!!!!!! ( ；∀；)**

### 離線安裝

[CI](https://github.com/hakadao/BewlyBewly/actions)：自動建置最新的程式碼

[Releases](https://github.com/hakadao/BewlyBewly/releases)：穩定版本

#### Edge 和 Chrome (推薦)

> 確保您已下載 [extension.zip](https://github.com/hakadao/BewlyBewly/releases)。

在 Edge 中打開 `edge://extensions` 頁面或在 Chrome 中打開 `chrome://extensions` 頁面，只需將下載的 `extension.zip` 檔案拖放到瀏覽器中，即可完成安裝。

<details>
 <summary> Edge 和 Chrome 的另一種安裝方法 </summary>

#### Edge

> 確保您已下載 [extension.zip](https://github.com/hakadao/BewlyBewly/releases) 並且解壓縮此檔案。

1. 在地址欄中輸入 `edge://extensions/`，然後按下 Enter 鍵
2. 打開`開發者模式`，然後按下`載入解壓縮` <br/> <img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/232246901-e3544c16-bde2-480d-b770-ca5242793963.png">
3. 將已解壓縮的擴充功能的資料夾載入到您的瀏覽器

#### Chrome
>
> 確保您已下載 [extension.zip](https://github.com/hakadao/BewlyBewly/releases) 並且解壓縮此檔案。

1. 在地址欄中輸入 `chrome://extensions/`，然後按下 Enter 鍵
2. 打開`開發者模式`，然後按下`載入解壓縮` <br/> <img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
3. 將已解壓縮的擴充功能的資料夾載入到您的瀏覽器

</details>

## 🔧 開發與建置

### Chrome or Edge browser

<details>
  <summary>Chrome or Edge browser</summary>

#### 開發 (Chrome or Edge)

```bash
pnpm dev
```

然後在瀏覽器中使用 `extension/` 資料夾載入此擴充功能。
每次修改後，您需要點選 [Extensions Reloader](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) 按鈕，然後重新整理頁面，以確保更改生效。

#### 建置 (Chrome or Edge)

建置此擴充功能，需要執行以下指令

```bash
pnpm build
```

然後打包 `extension` 下的檔案

</details>

### Firefox browser

在那之前，請使用 `dev-firefox` 分支來進行以下操作。它可能包含一些錯誤或不清楚的代碼，歡迎您幫忙解決這些問題！:D

<details>
  <summary>Firefox browser</summary>

#### 開發 (Firefox)

```bash
pnpm dev-firefox
```

然後在瀏覽器中使用 `extension-firefox/` 資料夾載入此擴充功能。
每次修改後，您需要點選 [Extensions Reloader](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) 按鈕，然後重新整理頁面，以確保更改生效。

#### 建置 (Firefox)

建置此擴充功能，需要執行以下指令

```bash
pnpm build-firefox
```

然後打包 `extension-firefox` 下的檔案

</details>

## 🤝 貢獻

### 關於分支

- **Main**: 此分支設計用於僅涉及文件檔案（如 README 檔案）的更改，不更改程式碼或其功能。
- **Dev**: 使用此分支進行新功能的開發、改進效能或對語系檔（i18n）的修改。
- **Bugfixes**: 此分支專門用於修正 main 分支中出現的錯誤。

### I18n

- 在進行翻譯時，如果你遇到一種你不熟悉的語言，你可以使用另一種你已經翻譯過的語言來翻譯，並在 PR 中指出你無法翻譯的那個語言。
- **請手動維護 i18n 國際化語系檔！！！** 請勿使用 `i18n Ally` 或其他擴充套件來進行維護。 我知道你可能會感到困惑，或者可能不喜歡這樣做，但使用 `i18n Ally` 進行維護後，將不確定翻譯放在哪裏，或刪除程式碼註解。

## ❤️ 鳴謝

- [vitesse-webext](https://github.com/antfu/vitesse-webext) - 此專案所用的範例
- [UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome), [bilibili-app-recommend](https://github.com/magicdawn/bilibili-app-recommend) - 參考取得 access key 之方法
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) - 部分功能的實現
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
