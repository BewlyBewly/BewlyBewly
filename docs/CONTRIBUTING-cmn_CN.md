# 贡献指南

[English](CONTRIBUTING.md) | [官话 - 简体中文](CONTRIBUTING-cmn_CN.md) | [官話 - 正體中文](CONTRIBUTING-cmn_TW.md) | [廣東話](CONTRIBUTING-jyut.md)

## 💻 设置开发环境

此项目是基于 [Vite](https://vitejs.dev/) 构建的，请确保本地安装了 [Node.js](https://nodejs.org/) 和 [pnpm](https://pnpm.io/)，
同时建议你用 [Visual Studio Code](https://code.visualstudio.com/) 进行开发。

## 🔧 开发和构建项目

### 开发 (Chrome or Edge)

1. 运行 pnpm 命令

  ```bash
  # 安装依赖
  pnpm install

  # 运行项目
  pnpm dev
  ```

2. 在地址栏输入 `chrome://extensions/` (Chrome), `edge://extensions/` (Edge) 并按回车

3. 打开 `开发者模式` 并点击 `加载已解压的拓展程序`

<img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
<br/>
<img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/232246901-e3544c16-bde2-480d-b770-ca5242793963.png">

4. 在浏览器中加载生成的 `extension/` 文件夹

每次修改后，您需要单击 [Reload Extensions](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) 按钮并刷新页面以确保应用更改。

#### 构建 (Chrome or Edge)

要构建拓展程序，运行

```bash
pnpm build
```

然后打包到 `extension` 文件夹

### 开发 (Firefox)

1. 运行 pnpm 命令

```bash
# 安装依赖
pnpm install

# 运行项目
pnpm dev
```

2. 在浏览器输入 `about:addons` 之后点击 `Extensions` 然后 `Debug Add-ons`

<img width="655" alt="image" src="https://github.com/hakadao/BewlyBewly/assets/33394391/7c49e4ca-2a87-4c56-bc00-3259d6eba128">

3. 在浏览器中加载生成的 `extension-firefox/` 文件夹

#### 构建 (Firefox)

要构建拓展程序，运行

```bash

pnpm build-firefox

```

然后打包到 `extension-firefox` 文件夹

## 🤝 贡献

### 关于分支

#### 常驻分支

- **Dev**: 用此分支进行错误修复、新功能的开发、性能改进或对国际化（i18n）文件的修改。
- **Main**: 主分支，代表稳定可发布的版本。

#### 其他临时分支

- **feat/**: 此分支用于提交新的功能
- **doc/**: 此分支专门用于修复文档, 不涉及功能改动。
- **fix/**: 此分支专门用于修复 dev 分支中出现的错误。

### commit 规范

- `feat`：新功能
- `fix`：修复 Bug
- `docs`：文档更新
- `style`：样式调整
- `refactor`：重构代码
- `test`：添加或更新测试
- `chore`：构建过程或工具链的变更
- `perf`：性能改进
- `ci`：持续集成/交付的变更
也欢迎增加 scope 和 footer
例如:
`fix(dock): xxx`
`变更描述`
`相关 PR: url`

### I18n

- 在进行翻译时，如果你遇到一种你不熟悉的语言，可以使用另一种你已经翻译过的语言，并在 PR 中指出你无法翻译的语言。

- **请手动维护 i18n 国际化文件！！！** 不要使用 `i18n Ally` 或其他扩展来维护它们。我知道你可能会感到困惑或不喜欢这样做，但使用 `i18n Ally` 进行维护会不确定翻译放在哪里或删除代码注释。
