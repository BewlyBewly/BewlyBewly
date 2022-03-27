# BewlyBewly

<p align="center">
<img width="150" src="https://user-images.githubusercontent.com/33394391/160250512-410b71fc-7f25-4caf-b850-429227ff082a.png"><br/>
</p>

Bringing you the suggested videos on the bilibili homepage, clean and simple.




<p align="center">
<sub>Inject Vue App into bilibili homepage</sub><br/>
<img width="655" src="https://user-images.githubusercontent.com/33394391/160250313-6a3db903-53c5-431a-8ddd-80a50725087a.png"><br/>
</p>

## Installation

> Ensure you installed [extension.zip](https://github.com/hakadao/BewlyBewly/releases) and decompress this file.

### Chrome

1. Type in `chrome://extensions/` in the address bar and press Enter
2. Turn on `Developer mode` then press `Load unpacked` <br/> <img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
3. Load decompressed exetension folder in your browser <br/> <img width="655" alt="Snipaste_2022-03-27_18-44-20" src="https://user-images.githubusercontent.com/33394391/160277821-a950074f-cc2f-4bd2-94b6-48c3d2dc851a.png">

### Edge

1. Type in `edge://extensions/` in the address bar and press Enter
2. Turn on `Developer mode` then press `Load unpacked` <br/> <img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/160278008-37899cd2-e12f-4153-91e9-7ad72a11457e.png">
3. Load decompressed exetension folder in your browser 



## Getting started

To get suggested videos on the homepage, click on the `Settings` button in the bottom right corner.

<img width="200" src="https://user-images.githubusercontent.com/33394391/160269696-265fbe8f-00fb-4cb6-bd86-b9c0a385253c.png">

Make sure you log in to bilibili first and then click on the `Authorize` button.

<img width="655" src="https://user-images.githubusercontent.com/33394391/160272991-1351ec1d-32a6-4faf-8cd7-4d12a2445958.png">

When the `Authorize` button changes to the `Revoke` button, you can get suggested videos based on what you watch.

## Authorization & Access Key

https://github.com/indefined/UserScripts/tree/master/bilibiliHome#%E6%8E%88%E6%9D%83%E8%AF%B4%E6%98%8E

## Development & build

### Development

```bash
pnpm dev
```

Then **load extension in browser with the `extension/` folder**.

### Build

To build the extension, run

```bash
pnpm build
```

And then pack files under `extension`

# Credits

[vitesse-webext](https://github.com/antfu/vitesse-webext)

[UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome)

[bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
