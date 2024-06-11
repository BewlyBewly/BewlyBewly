# BewlyBewly

English | [官话 - 简体中文](README-cmn_CN.md) | [官話 - 正體中文](README-cmn_TW.md) | [廣東話](README-jyut.md)

<p align="center" style="margin-bottom: 0px !important;">
<img width="100" alt="bewlybewly icon" src="https://user-images.githubusercontent.com/33394391/160250512-410b71fc-7f25-4caf-b850-429227ff082a.png"><br/>
</p>

<h1 align="center" style="margin-top: 0px;">BewlyBewly</h1>

<p align="center">Just make a few small changes to your Bilibili homepage.</p>

<!-- ![min1](https://github.com/hakadao/BewlyBewly/assets/33394391/951f9e2a-d0e1-452c-83a9-dc6d85c4d441)
![min2](https://github.com/hakadao/BewlyBewly/assets/33394391/3e75dd20-f60b-4645-b434-23a24c72959c) -->

## 👋 Introduction

BewlyBewly is a browser extension for BiliBili that aims to enhance the user experience by redesigning the BiliBili UI.
The design is inspired by YouTube, Vision OS, and iOS, resulting in a more visually appealing and user-friendly interface.
This project uses the [vitesse-webext](https://github.com/antfu/vitesse-webext) template for development.
Without this template, it may not be possible to develop this project.

## 🔨 Build (Firefox)

Please make sure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed locally, and it is recommended to use [Visual Studio Code](https://code.visualstudio.com/) for development.

1. To build the extension, run

```bash
# Install dependencies
pnpm install

pnpm build-firefox
```

2. Load the generated `extension-firefox/` folder in the browser, The extension will then take effect on [www.bilibili.com](https://www.bilibili.com).

[Chrome & Edge](/docs/CONTRIBUTING.md#building-chrome-or-edge)

## ⬇️ Installation

### Online Installation

> [!Caution]
> Even in the Edge browser, we strongly recommend you install it in the Chrome web store.
> In terms of review speed, the Chrome web store is faster than Edge Add-ons.
>
> Additionally, the Chrome Web Store version of BewlyBewly will address and fix critical bugs more quickly.

- Chrome: <https://chromewebstore.google.com/detail/bewlybewly/bbbiejemhfihiooipfcjmjmbfdmobobp>
- Edge (NOT RECOMMENDED): <https://microsoftedge.microsoft.com/addons/detail/bewlybewly/kceadhehfjdiakpiphpjgolbgehjdmja>
- Firefox: <https://addons.mozilla.org/en-US/firefox/addon/bewlybewly/>

#### To Firefox users

> [!WARNING]
> When using the Firefox browser, remember to enable all permissions shown in the picture below for normal use of BewlyBewly

<br/> <img width="655" alt="enable all bewlybewly permissions on firefox" src="https://github.com/hakadao/BewlyBewly/assets/33394391/9566aed8-040a-4435-a2ec-c61117f8e429">

### Local Installation

[CI](https://github.com/hakadao/BewlyBewly/actions): Automatically build with the latest code

[Releases](https://github.com/hakadao/BewlyBewly/releases): Stable version

#### Edge & Chrome (RECOMMENDED)

> Ensure you installed [extension.zip](https://github.com/hakadao/BewlyBewly/releases) .

Opening the `edge://extensions` page in the Edge or `chrome://extensions` page in Chrome,
simply drag and drop the downloaded `extension.zip` file into the browser to complete the installation.

<details>
 <summary> Another installation method for Edge & Chrome </summary>

#### Edge

> Ensure you installed [extension.zip](https://github.com/hakadao/BewlyBewly/releases) and decompress this file.

1. Type in `edge://extensions/` in the address bar and press Enter
2. Turn on `Developer mode` then press `Load Unpacked` <br/> <img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/232246901-e3544c16-bde2-480d-b770-ca5242793963.png">
3. Load the decompressed extension folder in your browser

#### Chrome
>
> Ensure you installed [extension.zip](https://github.com/hakadao/BewlyBewly/releases) and decompress this file.

1. Type in `chrome://extensions/` in the address bar and press Enter
2. Turn on `Developer mode` then press `Load Unpacked` <br/> <img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
3. Load the decompressed extension folder in your browser

</details>

## 🤝 Contribution

See [CONTRIBUTION.md](docs/CONTRIBUTING.md)

### Contributors

![Contributors](https://contrib.rocks/image?repo=hakadao/BewlyBewly)

## ❤️ Credits

- [vitesse-webext](https://github.com/antfu/vitesse-webext) - The template used for this project
- [UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome),
[bilibili-app-recommend](https://github.com/magicdawn/bilibili-app-recommend) - Reference source for obtaining the access key
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) - Partial implementation of functionalities
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
