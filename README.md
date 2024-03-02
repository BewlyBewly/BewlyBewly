# BewlyBewly

English | [简体中文](README-cmn_CN.md) | [正體中文](README-cmn_TW.md) | [廣東話](README-jyut.md)

<p align="center" style="margin-bottom: 0px !important;">
<img width="150" src="https://user-images.githubusercontent.com/33394391/160250512-410b71fc-7f25-4caf-b850-429227ff082a.png"><br/>
</p>

<h1 align="center" style="margin-top: 0px;">BewlyBewly</h1>

<p align="center">Just make a few small changes to your Bilibili homepage.</p>

![Image 3840x2400](https://github.com/hakadao/BewlyBewly/assets/33394391/ad726480-e6ef-4823-82e0-e3c3735a3909)
![Snipaste_2023-11-21_00-26-26](https://github.com/hakadao/BewlyBewly/assets/33394391/b1c1c25a-482a-438f-8e61-4d67cb32aea1)
![Snipaste_2023-11-21_00-30-03](https://github.com/hakadao/BewlyBewly/assets/33394391/1a9f0c56-5053-40d9-bec8-72665f85962d)
![Snipaste_2023-11-21_00-30-30](https://github.com/hakadao/BewlyBewly/assets/33394391/4cb44949-8352-4607-9dd4-74a8d1e00a74)
![Snipaste_2023-11-21_00-31-33](https://github.com/hakadao/BewlyBewly/assets/33394391/9ebebfd9-d8a8-411d-8c10-cf7cdb60abd4)
![Snipaste_2023-11-21_00-31-54](https://github.com/hakadao/BewlyBewly/assets/33394391/86ad5303-56b2-4d68-985d-300f2825ee49)
![Snipaste_2023-11-21_00-32-06](https://github.com/hakadao/BewlyBewly/assets/33394391/64b6eac1-d9ee-4157-a850-b940700a565b)
![Snipaste_2023-11-21_00-32-22](https://github.com/hakadao/BewlyBewly/assets/33394391/2533a1f9-3cb1-402e-96bb-3755404ddf02)
![Snipaste_2023-11-21_00-32-51](https://github.com/hakadao/BewlyBewly/assets/33394391/a439ea59-cc80-48aa-9c6a-ec5d4da98441)

## ⬇️ Installation

### Online Installation

Even in the Edge browser, we strongly recommend you install it in the Chrome web store. In terms of review speed, the Chrome web store is slightly faster than Edge Add-ons.

- Chrome: <https://chromewebstore.google.com/detail/bewlybewly/bbbiejemhfihiooipfcjmjmbfdmobobp>
- Edge: <https://microsoftedge.microsoft.com/addons/detail/bewlybewly/kceadhehfjdiakpiphpjgolbgehjdmja>
- Firefox: **I NEED SOME HELP!!!!!!!!!!!!!!!!!! ( ；∀；)**

### Local Installation

[CI](https://github.com/hakadao/BewlyBewly/actions)：Automatically build with the latest code

[Releases](https://github.com/hakadao/BewlyBewly/releases)：Stable version

#### Edge & Chrome (RECOMMENDED)

> Ensure you installed [extension.zip](https://github.com/hakadao/BewlyBewly/releases) .

Opening the `edge://extensions` page in the Edge or `chrome://extensions` page in Chrome, simply drag and drop the downloaded `extension.zip` file into the browser to complete the installation.

<details>
 <summary> Another installation method for Edge & Chrome </summary>

#### Edge

> Ensure you installed [extension.zip](https://github.com/hakadao/BewlyBewly/releases) and decompress this file.

1. Type in `edge://extensions/` in the address bar and press Enter
2. Turn on `Developer mode` then press `Load unpacked` <br/> <img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/232246901-e3544c16-bde2-480d-b770-ca5242793963.png">
3. Load the decompressed extension folder in your browser

#### Chrome
>
> Ensure you installed [extension.zip](https://github.com/hakadao/BewlyBewly/releases) and decompress this file.

1. Type in `chrome://extensions/` in the address bar and press Enter
2. Turn on `Developer mode` then press `Load unpacked` <br/> <img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
3. Load the decompressed extension folder in your browser

</details>

## 🔧 Development & Build

### Chrome or Edge browser

<details>
  <summary>Chrome or Edge browser</summary>

#### Development (Chrome or Edge)

```bash
pnpm dev
```

Then **load the extension in the browser with the `extension/` folder**.
After each modification, you need to click the [Extensions Reloader](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) button and refresh the page to ensure the changes will be applied.

##### Build (Chrome or Edge)

To build the extension, run

```bash
pnpm build
```

And then pack files under the `extension`

</details>

### Firefox browser

Before that, please use the `dev-firefox` branch to perform the operations below. It may contain some bugs or unclear code, and your help in addressing these issues is welcome! :D

<details>
  <summary>Firefox browser</summary>

#### Development (Firefox)

```bash
pnpm dev-firefox
```

Then **load the extension in the browser with the `extension-firefox/` folder**.
After each modification, you need to click the [Extensions Reloader](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) button and refresh the page to ensure the changes will be applied.

#### Build (Firefox)

To build the extension, run

```bash
pnpm build-firefox
```

And then pack files under the `extension-firefox`

</details>

## 🤝 Contribution

### About Branches

- **Main**: This branch is designed for changes that are restricted to documentation files like READMEs, without altering the code or its functionality.
- **Dev**: Use this branch for new features, performance improvements or modifications to i18n files.
- **Bugfixes**: This branch should be used exclusively for fixing bugs that appear in the main branch.

### I18n

- When doing translations, if you have a language you are not familiar with, you can use another language that you have translated and point out what language you cannot translate in the pull request.

- **Please MANUALLY MAINTAIN the i18n files!!!** Do not use `i18n Ally` or other extensions to maintain them. I know you might be confused or might not like this, but using `i18n Ally` for the maintenance will make it uncertain where to place the translations afterward or delete the code comments.

## ❤️ Credits

- [vitesse-webext](https://github.com/antfu/vitesse-webext) - The template used for this project
- [UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome), [bilibili-app-recommend](https://github.com/magicdawn/bilibili-app-recommend) - Reference source for obtaining the access key
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) - Partial implementation of functionalities
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
