# Changelog

## [0.13.0](https://github.com/hakadao/BewlyBewly/compare/v0.12.0..v0.13.0) (2024-01-02)

### Notices

* Please note that the version on Chrome Web Store & Edge Addons may not update as quickly
* 本地安裝瀏覽器打開 chrome://extensions 頁面之後直接將下載完後的 extension.zip 拖入瀏覽器即可完成安裝

### Features

feat: add a setting to use the original bilibili homepage
feat: add compatibility page on settings panel
feat: add contributors section & export settings description to the about page on the settings panel
feat: implement reset content feature in dock
feat: create ci build for action (@MengNianxiaoyao)
feat: dock item visibility adjustment

### Bug Fixes

fix: resolve the issue of blurry font, i guess... (#49)
fix: open History‘s article is error (@MengNianxiaoyao)
fix: 【Bug】观看历史界面部分专栏封面不显示 (@MengNianxiaoyao #87)
fix: bilibili-API-collect docs link (@MengNianxiaoyao)
fix: resolve ts errors and warnings
fix: 【Bug】使用插件的顶栏会导致部分专栏打开失败 (@MengNianxiaoyao #83)
fix: adjust styles(#77)

perf: optimize extension loading speed (#75)

refactor: rename topbar to topBar
refactor: use pinia to store top bar items (wip)
refactor: move contents from the src/models/apiModels to parent directory
refactor: remove startup page setting, determine startup page based on dock content
refactor: use pinia && move app.use() to common-setup

docs: 添加廣東話，台灣官話README翻譯
docs: 优化说明文档并添加简体中文 (@MengNianxiaoyao)

### New Contributors

@MengNianxiaoyao 幫忙翻譯簡體中文README, 構建ci, 翻譯調整, 部分功能等問題修正

**Full Changelog:** <https://github.com/hakadao/BewlyBewly/compare/v0.12.0..v0.13.0>
