# BewlyBewly

Bringing you the suggested videos on bilibili homepage, clean and simple.

<p align="center">
<img width="200" src="https://user-images.githubusercontent.com/33394391/160250512-410b71fc-7f25-4caf-b850-429227ff082a.png"><br/>
</p>


<p align="center">
<sub>Inject Vue App into bilibili homepage</sub><br/>
<img width="655" style="border-radius: 12px" src="https://user-images.githubusercontent.com/33394391/160250313-6a3db903-53c5-431a-8ddd-80a50725087a.png"><br/>
</p>

## Getting started

To get suggested videos on the homepage, click on the `Settings` button in the bottom right corner.

![](https://user-images.githubusercontent.com/33394391/160269696-265fbe8f-00fb-4cb6-bd86-b9c0a385253c.png)

Make sure you log in to bilibili first and then click on the `Authorize` button.

![](https://user-images.githubusercontent.com/33394391/160272991-1351ec1d-32a6-4faf-8cd7-4d12a2445958.png)

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

And then pack files under `extension`, you can upload `extension.crx` or `extension.xpi` to appropriate extension store.

# Credits

[vitesse-webext](https://github.com/antfu/vitesse-webext)

[UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome)

[bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)
