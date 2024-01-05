# BewlyBewly

[English](README.md) | 官话 - 简体中文 | [官話 - 正體中文](README-cmn_TW.md) | [廣東話](README-jyut.md)

<p align="center" style="margin-bottom: 0px !important;">
<img width="150" src="https://user-images.githubusercontent.com/33394391/160250512-410b71fc-7f25-4caf-b850-429227ff082a.png"><br/>
</p>

<h1 align="center" style="margin-top: 0px;">BewlyBewly</h1>

<p align="center">只需对您的 Bilibili 主页进行一些小更改即可。</p>

![Image 3840x2400](https://github.com/hakadao/BewlyBewly/assets/33394391/ad726480-e6ef-4823-82e0-e3c3735a3909)
![Snipaste_2023-11-21_00-26-26](https://github.com/hakadao/BewlyBewly/assets/33394391/b1c1c25a-482a-438f-8e61-4d67cb32aea1)
![Snipaste_2023-11-21_00-30-03](https://github.com/hakadao/BewlyBewly/assets/33394391/1a9f0c56-5053-40d9-bec8-72665f85962d)
![Snipaste_2023-11-21_00-30-30](https://github.com/hakadao/BewlyBewly/assets/33394391/4cb44949-8352-4607-9dd4-74a8d1e00a74)
![Snipaste_2023-11-21_00-31-33](https://github.com/hakadao/BewlyBewly/assets/33394391/9ebebfd9-d8a8-411d-8c10-cf7cdb60abd4)
![Snipaste_2023-11-21_00-31-54](https://github.com/hakadao/BewlyBewly/assets/33394391/86ad5303-56b2-4d68-985d-300f2825ee49)
![Snipaste_2023-11-21_00-32-06](https://github.com/hakadao/BewlyBewly/assets/33394391/64b6eac1-d9ee-4157-a850-b940700a565b)
![Snipaste_2023-11-21_00-32-22](https://github.com/hakadao/BewlyBewly/assets/33394391/2533a1f9-3cb1-402e-96bb-3755404ddf02)
![Snipaste_2023-11-21_00-32-51](https://github.com/hakadao/BewlyBewly/assets/33394391/a439ea59-cc80-48aa-9c6a-ec5d4da98441)

## ⬇️ 安装

### 在线安装

即使在 Edge 浏览器中，我们也强烈建议您使用 Chrome 应用商店进行安装。在审核速度上，Chrome 应用商店的审核速度比 Edge 应用商店快得多。

- Chrome: <https://chrome.google.com/webstore/detail/bewlybewly/bbbiejemhfihiooipfcjmjmbfdmobobp/related?hl=cn>
- Edge: <https://microsoftedge.microsoft.com/addons/detail/bewlybewly/kceadhehfjdiakpiphpjgolbgehjdmja>
- Firefox: **我需要一些帮助!!!!!!!!!!!!!!!!!! ( ；∀；)**

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

## 🔧 开发 & 构建

### 开发

```bash
pnpm dev
```

然后**在浏览器中使用 `加载已解压的拓展程序` 加载 `extension` 文件夹**。
每次修改后，您需要单击 [重新加载](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) 按钮并刷新页面以确保应用更改。

### 构建

要构建拓展程序，运行

```bash
pnpm build
```

然后打包到 `extension` 文件夹

### 🤝 贡献

#### 关于分支

- **Main**: 此分支用于只涉及文档文件（如 README 文件）的更改，不改变代码或其功能。
- **Dev**: 用此分支进行新功能的开发、性能改进或对国际化（i18n）文件的修改。
- **Bugfixes**: 此分支专门用于修复 main 分支中出现的错误。

#### I18n

- 在进行翻译时，如果你遇到一种你不熟悉的语言，可以使用另一种你已经翻译过的语言，并在 PR 中指出你无法翻译的语言。

- **请手动维护 i18n 国际化文件！！！** 不要使用 `i18n Ally` 或其他扩展来维护它们。我知道你可能会感到困惑或不喜欢这样做，但使用 `i18n Ally` 进行维护会不确定翻译放在哪里或删除代码注释。

## ❤️ 鸣谢

- [vitesse-webext](https://github.com/antfu/vitesse-webext) - 该项目使用的模板
- [UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome), [bilibili-app-recommend](https://github.com/magicdawn/bilibili-app-recommend) - 获取访问密钥的参考来源
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) - 部分功能实现
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
