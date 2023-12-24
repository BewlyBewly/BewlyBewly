# BewlyBewly

[English](README.md) | [官话 - 简体中文](README-cmn_CN.md) | [官話 - 正體中文](README-cmn_TW.md) | 廣東話

<p align="center" style="margin-bottom: 0px !important;">
<img width="150" src="https://user-images.githubusercontent.com/33394391/160250512-410b71fc-7f25-4caf-b850-429227ff082a.png"><br/>
</p>

<h1 align="center" style="margin-top: 0px;">BewlyBewly</h1>

<p align="center">係咁以執吓你嘅 Bilibili 主頁。</p>

![Image 3840x2400](https://github.com/hakadao/BewlyBewly/assets/33394391/ad726480-e6ef-4823-82e0-e3c3735a3909)
![Snipaste_2023-11-21_00-26-26](https://github.com/hakadao/BewlyBewly/assets/33394391/b1c1c25a-482a-438f-8e61-4d67cb32aea1)
![Snipaste_2023-11-21_00-30-03](https://github.com/hakadao/BewlyBewly/assets/33394391/1a9f0c56-5053-40d9-bec8-72665f85962d)
![Snipaste_2023-11-21_00-30-30](https://github.com/hakadao/BewlyBewly/assets/33394391/4cb44949-8352-4607-9dd4-74a8d1e00a74)
![Snipaste_2023-11-21_00-31-33](https://github.com/hakadao/BewlyBewly/assets/33394391/9ebebfd9-d8a8-411d-8c10-cf7cdb60abd4)
![Snipaste_2023-11-21_00-31-54](https://github.com/hakadao/BewlyBewly/assets/33394391/86ad5303-56b2-4d68-985d-300f2825ee49)
![Snipaste_2023-11-21_00-32-06](https://github.com/hakadao/BewlyBewly/assets/33394391/64b6eac1-d9ee-4157-a850-b940700a565b)
![Snipaste_2023-11-21_00-32-22](https://github.com/hakadao/BewlyBewly/assets/33394391/2533a1f9-3cb1-402e-96bb-3755404ddf02)
![Snipaste_2023-11-21_00-32-51](https://github.com/hakadao/BewlyBewly/assets/33394391/a439ea59-cc80-48aa-9c6a-ec5d4da98441)

## ⬇️ 單撈

### 線上單嘢

即使你用嘅係 Edge browser，我哋都係建議你喺返 Chrome 線上應用程式商店單撈。事關喺審核速度上，Chrome 線上應用程式商店照計係快過 Edge 的附加元件一啲嘅。

- Chrome: <https://chrome.google.com/webstore/detail/bewlybewly/bbbiejemhfihiooipfcjmjmbfdmobobp/related?hl=en>
- Edge: <https://microsoftedge.microsoft.com/addons/detail/bewlybewly/kceadhehfjdiakpiphpjgolbgehjdmja>
- Firefox: **我要人幫手!!!!!!!!!!!!!!!!!! ( ；∀；)**

### 離線單嘢

[CI](https://github.com/hakadao/BewlyBewly/actions)：自動建置最新嘅程式碼

[Releases](https://github.com/hakadao/BewlyBewly/releases)：穩定版本

#### Edge 同 Chrome (推介)

> 確保你單咗 [extension.zip](https://github.com/hakadao/BewlyBewly/releases)。

喺 Edge 入邊打開 `edge://extensions` 頁面抑或喺 Chrome 度打開 `chrome://extensions` 頁面，淨係要你將單咗嘅 `extension.zip` 檔案擺到 browser 度，就攪掂喇。

<details>
 <summary> Edge 同 Chrome 第種單撈方法 </summary>

#### Edge

> 確保你單咗 [extension.zip](https://github.com/hakadao/BewlyBewly/releases) 兼且解壓縮個檔案

1. 喺地址欄入邊輸入 `edge://extensions/`，然之後撳 Enter
2. 打開`開發者模式`，撳`載入解壓縮` <br/> <img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/232246901-e3544c16-bde2-480d-b770-ca5242793963.png">
3. 將解開嘅擴充功能資料夾載入到你嘅瀏覽器度

#### Chrome
>
> 確保你單咗 [extension.zip](https://github.com/hakadao/BewlyBewly/releases) 兼且解壓縮個檔案

1. 在地址欄中輸入 `chrome://extensions/`，然後按下 Enter 鍵
2. 打開`開發者模式`，撳`載入解壓縮` <br/> <img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
3. 將解開嘅擴充功能資料夾載入到你嘅瀏覽器度

</details>

## 🔧 開發同建置

### 開發

```bash
pnpm dev
```

然之後喺瀏覽器度用 `extension/` 資料夾愛嚟載入此擴充功能。
每一次執過 code 之後，你都要撳 [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) 粒掣，然之後 refresh 個 page，確保係有效果。

### 建置

建置擴充功能，要執行下底嘅指令

```bash
pnpm build
```

然之後打包 `extension` 下嘅檔案

### 🤝 一齊整

#### i18n

- 喺翻譯嗰陣，若然你遇到一種你唔熟嘅語言，你可以用第種識翻譯嘅語言來翻譯，兼且喺 PR 講明你唔識譯邊種語言。
- **請手動維護 i18n 國際化語系檔！！！** 請勿使用 `i18n Ally` 抑或其他擴充套件維護。 我知你可能唔係幾明，抑或可能唔鍾意咁樣，但係用 `i18n Ally` 進行維護之後，你唔之你翻譯咗嘅內容擺喺邊處，或剷咗程式碼註解。

## ❤️ 鳴謝

- [vitesse-webext](https://github.com/antfu/vitesse-webext) - 專案所用嘅範例
- [UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome), [bilibili-app-recommend](https://github.com/magicdawn/bilibili-app-recommend) - 參考取得 access key 之方法
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) - 部分功能嘅實現
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
