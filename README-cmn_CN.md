# BewlyBewly

[English](README.md) | 官话 - 简体中文 | [官話 - 正體中文](README-cmn_TW.md) | [廣東話](README-jyut.md)

<p align="center" style="margin-bottom: 0px !important;">
<img width="150" alt="bewlybewly icon" src="https://user-images.githubusercontent.com/33394391/160250512-410b71fc-7f25-4caf-b850-429227ff082a.png"><br/>
</p>

<h1 align="center" style="margin-top: 0px;">BewlyBewly</h1>

<p align="center">只需对您的 Bilibili 主页进行一些小更改即可。</p>

![min1](https://github.com/hakadao/BewlyBewly/assets/33394391/951f9e2a-d0e1-452c-83a9-dc6d85c4d441)
![min2](https://github.com/hakadao/BewlyBewly/assets/33394391/3e75dd20-f60b-4645-b434-23a24c72959c)

## 👋 介绍

BewlyBewly 是一个用于 BiliBili 的浏览器扩展，旨在通过重新设计 BiliBili 用户界面来提升用户体验。设计灵感来自于 YouTube、Vision OS 和 iOS，从而实现了更具视觉吸引力和用户友好性的界面。

该项目使用 [vitesse-webext](https://github.com/antfu/vitesse-webext) 模板进行开发。如果没有这个模板，可能无法开发出这个项目。

## ⬇️ 安装

### 在线安装

> [!Caution]
> 即使在 Edge 浏览器中，我们也强烈建议您使用 Chrome 应用商店进行安装。在审核速度上，Chrome > 应用商店的审核速度比 Edge 应用商店快得多。
>
> 此外，BewlyBewly 的 Chrome Web Store 版本将更快地解决和修复关键性错误。

- Chrome: <https://chromewebstore.google.com/detail/bewlybewly/bbbiejemhfihiooipfcjmjmbfdmobobp>
- Edge (不推荐): <https://microsoftedge.microsoft.com/addons/detail/bewlybewly/kceadhehfjdiakpiphpjgolbgehjdmja>
- Firefox: <https://addons.mozilla.org/lt/firefox/addon/bewlybewly/>

#### 对于 Firefox 用户

> [!WARNING]
> 使用 Firefox 浏览器时，请记得启用下面图片中显示的所有权限，以正常使用 BewlyBewly

<br/> <img width="655" alt="enable all bewlybewly permissions on firefox" src="https://github.com/hakadao/BewlyBewly/assets/33394391/9566aed8-040a-4435-a2ec-c61117f8e429">

### 本地安装

[CI](https://github.com/hakadao/BewlyBewly/actions)：使用最新代码自动构建

[Releases](https://github.com/hakadao/BewlyBewly/releases)：稳定版

#### Edge 和 Chrome（推荐）

> 确保您下载了 [extension.zip](https://github.com/hakadao/BewlyBewly/releases)。

在 Edge 浏览器中打开 `edge://extensions` 或者在 Chrome 浏览器中打开 `chrome://extensions` 界面，只需将下载的 `extension.zip` 文件拖放到浏览器中即可完成安装。

<details>
 <summary> Edge & Chrome 的另一种安装方法 </summary>

#### Edge

> 确保您下载了 [extension.zip](https://github.com/hakadao/BewlyBewly/releases) 并解压缩该文件。

1. 在地址栏输入 `edge://extensions/` 并按回车
2. 打开 `开发者模式` 并点击 `加载已解压的拓展程序` <br/> <img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/232246901-e3544c16-bde2-480d-b770-ca5242793963.png">
3. 在浏览器中加载解压后的扩展文件夹

#### Chrome

> 确保您下载了 [extension.zip](https://github.com/hakadao/BewlyBewly/releases) 并解压缩该文件。

1. 在地址栏输入 `chrome://extensions/` 并按回车
2. 打开 `开发者模式` 并点击 `加载已解压的拓展程序` <br/> <img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
3. 在浏览器中加载解压后的扩展文件夹

</details>

## 🤝 贡献

查看 [CONTRIBUTION.md](docs/CONTRIBUTING.md)

### 贡献者

![Contributors](https://contrib.rocks/image?repo=hakadao/BewlyBewly)

## ❤️ 鸣谢

- [vitesse-webext](https://github.com/antfu/vitesse-webext) - 该项目使用的模板
- [UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome),
[bilibili-app-recommend](https://github.com/magicdawn/bilibili-app-recommend) - 获取访问密钥的参考来源
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) - 部分功能实现
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
