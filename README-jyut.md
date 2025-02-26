# BewlyBewly

[English](README.md) | [官话 - 简体中文](README-cmn_CN.md) | [官話 - 繁體中文](README-cmn_TW.md) | 廣東話

<p align="center" style="margin-bottom: 0px !important;">
<img width="300" alt="BewlyBewly icon" src="https://cdn.jsdelivr.net/gh/BewlyBewly/Imgs/logos/bewlybewly-vtuber-logo.png"><br/>
</p>

<p align="center">係咁以執吓你嘅 Bilibili 主頁。</p>

<!-- ![min1](https://github.com/hakadao/BewlyBewly/assets/33394391/951f9e2a-d0e1-452c-83a9-dc6d85c4d441)
![min2](https://github.com/hakadao/BewlyBewly/assets/33394391/3e75dd20-f60b-4645-b434-23a24c72959c) -->

## 👋 介紹

> [!IMPORTANT]
> BewlyBewly 主要着重頁面調整同埋改善, 而唔係完善功能同提升效率
>
> 事關考慮到維護嘅效率同埋難度, 深色模式淨係會適應常用頁面, 一啲冇咁常用嘅頁面唔會適應調整

> [!CAUTION]
> [BLBewly](https://apps.apple.com/us/app/blbewly/id6742200021) 係 Safari 上嘅免費 BewlyBewly 延伸功能。我哋感謝 [𝗦𝘁𝗲𝘃𝗲 𝕏](https://x.com/st7evechou) 幫手免費將應用程式發佈到 Safari。
> 但係，Safari 版本遇到嘅問題唔喺我哋嘅維護範圍內，我哋唔會考慮 Safari 維護。

> [!CAUTION]
> 如果你單緊呢個延伸功能，你嘅瀏覽器可能會話佢可以睇到你嘅瀏覽紀錄。
>
> 呢個係因爲 BewlyBewly 用咗["tabs" 權限](https://developer.chrome.com/docs/extensions/reference/api/tabs)，呢個權限亦都可以用嚟讀取每個分頁，從而知道瀏覽紀錄，但係喺呢度冇用到。
>
> **有啲瀏覽器會同你講最壞嘅情況係點同最高嘅風險，確保你單咗之後嘅安全。**
> 另外，呢個項目係開源嘅，所以你可以睇到佢究竟做緊乜。

BewlyBewly 係一個用於 BiliBili 嘅瀏覽器延伸功能，目的係透過重新設計 BiliBili 嘅 UI 令到用戶體驗提升。設計靈感源於 YouTube、Vision OS 同 iOS，從而實現更具視覺吸引力同用戶友好嘅介面。

呢個專案係用咗 [vitesse-webext](https://github.com/antfu/vitesse-webext) 範例進行開發。若果冇咗呢個範例，BewlyBewly 得個吉。

## ⬇️ 單撈

### 線上單嘢

> [!TIP]
> 即使你用嘅係 Edge browser，我哋都係建議你喺返 Chrome 線上應用程式商店單撈。事關喺審核速度上，Chrome 線上應用程式商店照計係快過 Edge 的附加元件好鬼死多。~~Edge Add-ons 收皮啦屌~~
>
> 仲有，BewlyBewly 喺 Chrome 線上應用程式商店嘅版本執啲嚴重性嘅 bug 速度係會快趣過 Edge 附加元件好多嘅 ~~Edge Add-ons 你幾時死~~

- Chrome: <https://chromewebstore.google.com/detail/bewlybewly/bbbiejemhfihiooipfcjmjmbfdmobobp>
- Edge: <https://chromewebstore.google.com/detail/bewlybewly/bbbiejemhfihiooipfcjmjmbfdmobobp>
- Firefox: <https://addons.mozilla.org/zh-TW/firefox/addon/bewlybewly/>

#### Firefox 用家留意吓

> [!WARNING]
> 用 Firefox 瀏覽器嗰陣，爲咗你正常使用 BewlyBewly，記得開晒下邊圖片展示嘅權限

<br/> <img width="655" alt="enable all bewlybewly permissions on firefox" src="https://github.com/hakadao/BewlyBewly/assets/33394391/9566aed8-040a-4435-a2ec-c61117f8e429">

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

## 🤝 貢獻同建置專案

睇吓 [CONTRIBUTING.md](docs/CONTRIBUTING-jyut.md)

### 貢獻者

[![Contributors](https://contrib.rocks/image?repo=hakadao/BewlyBewly)](https://github.com/BewlyBewly/BewlyBewly/graphs/contributors)

## ❤️ 鳴謝

- [vitesse-webext](https://github.com/antfu/vitesse-webext) - 專案所用嘅範例
- [UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome), [bilibili-app-recommend](https://github.com/magicdawn/bilibili-app-recommend) - 參考取得 access key 之方法
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) - 部分功能嘅實現
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
