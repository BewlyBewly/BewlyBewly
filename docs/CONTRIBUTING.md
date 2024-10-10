# Contribution Guide

[English](CONTRIBUTING.md) | [官话 - 简体中文](CONTRIBUTING-cmn_CN.md) | [官話 - 正體中文](CONTRIBUTING-cmn_TW.md) | [廣東話](CONTRIBUTING-jyut.md)

## 💻 Setting up the Development Environment

This project is built using [Vite](https://vitejs.dev/), please make sure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed locally, and it is recommended to use [Visual Studio Code](https://code.visualstudio.com/) for development.

## 🔧 Developing and Building the Project

### Development (Chrome or Edge)

#### The First Method for Chrome or Edge

<details>
 <summary>Show more</summary>

1. Run the pnpm command

```bash
# Install dependencies
pnpm install

# Create a profile folder for the extension to store the login status
mkdir web-ext-profile

# Run the project
pnpm dev

# After typing this commend, it will automatically open a new Chrome window that opens BiliBili website
pnpm start:chromium
```

2. Every time you change the extension, it will reload, and you can see the changes by refreshing the webpage

</details>

#### The Alternative Method for Chrome or Edge

<details>
 <summary>Show more</summary>

1. Run the pnpm command

```bash
# Install dependencies
pnpm install

# Run the project
pnpm dev
```

2. Enter `chrome://extensions/` (Chrome), `edge://extensions/` (Edge) in the address bar and press Enter

3. Enable `Developer Mode` and click `Load unpacked`

<img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
<br/>
<img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/232246901-e3544c16-bde2-480d-b770-ca5242793963.png">

4. Load the generated `extension/` folder in the browser

After each modification, you need to click the [Reload Extensions](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) button and refresh the page to apply the changes.

</details>

#### Building (Chrome or Edge)

To build the extension, run

```bash
pnpm build
```

Then package it to the `extension` folder

### Development (Firefox)

#### The First Method for Firefox

<details>
 <summary>Show more</summary>

1. Run the pnpm command

```bash
# Install dependencies
pnpm install

# Create a profile folder for the extension to store the login status
mkdir web-ext-profile

# Run the project
pnpm dev

# After typing this commend, it will automatically open a new Firefox window that opens BiliBili website
pnpm start:firefox
```

2. Every time you change the extension, it will reload, and you can see the changes by refreshing the webpage

</details>

#### The Alternative Method for Firefox

<details>
 <summary>Show more</summary>

1. Run the pnpm command

```bash
# Install dependencies
pnpm install

# Run the project
pnpm dev
```

2. In the browser, enter `about:addons`, click on `Extensions` and then `Debug Add-ons`

<img width="655" alt="image" src="https://github.com/hakadao/BewlyBewly/assets/33394391/7c49e4ca-2a87-4c56-bc00-3259d6eba128">

3. Load the generated `extension-firefox/` folder in the browser

</details>

#### Building (Firefox)

To build the extension, run

```bash
pnpm build-firefox
```

Then package it to the `extension-firefox` folder

## 🤝 Contribution

### About Branches

#### Permanent Branches

- **Main**: Use this branch for bug fixes, developing new features, performance improvements, or modifications to internationalization (i18n) files.

#### Other Temporary Branches

- **feat/**: This branch is used to submit new features
- **doc/**: This branch is specifically used for fixing documentation, no functional changes.
- **fix/**: This branch is specifically used for fixing errors in the dev branch.

### Commit Convention

You can also refer to the [Angular commit message guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: Code refactoring
- `test`: Add or update tests
- `chore`: Changes to the build process or toolchain
- `perf`: Performance improvement
- `ci`: Changes to continuous integration/delivery
Also welcome to add scope and footer
For example:
`fix(dock): xxx`
`Change description`
`Related PR: url`

### I18n

- When doing translations, if you have a language you are not familiar with, you can use another language that you have translated and point out what language you cannot translate in the pull request.

- **Please MANUALLY MAINTAIN the i18n files!!!** Do not use `i18n Ally` or other extensions to maintain them. I know you might be confused or might not like this, but using `i18n Ally` for the maintenance will make it uncertain where to place the translations afterward or delete the code comments.
