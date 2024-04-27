import type { ComputedRef } from 'vue'

export const searchBarCharacters = computed((): { name: string, url: string }[] => {
  return [
    { name: '22 娘', url: 'bewly://assets/searchBarCharacters/22chan-1.png' },
    { name: '33 娘', url: 'bewly://assets/searchBarCharacters/33chan-1.png' },
    { name: '22 娘', url: 'bewly://assets/searchBarCharacters/22chan-2.png' },
    { name: '33 娘', url: 'bewly://assets/searchBarCharacters/33chan-2.png' },
  ]
})

export const wallpapers = computed<Array<{ name: string, url: string, thumbnail: string }>>(() => {
  return [
    {
      name: 'Unsplash Random Nature Image',
      url: 'https://source.unsplash.com/1920x1080/?nature',
      thumbnail: 'https://source.unsplash.com/1920x1080/?nature',
    },
    {
      name: 'Unsplash Random Building Image',
      url: 'https://source.unsplash.com/1920x1080/?building',
      thumbnail: 'https://source.unsplash.com/1920x1080/?building',
    },
    {
      name: 'Unsplash Random Night Scene Image',
      url: 'https://source.unsplash.com/1920x1080/?night-scene',
      thumbnail: 'https://source.unsplash.com/1920x1080/?night-scene',
    },
    {
      name: 'LoremPicsum Random Image',
      url: 'https://picsum.photos/2560/1440/?nature',
      thumbnail: 'https://picsum.photos/2560/1440/?nature',
    },
    {
      name: 'Nicolas Lafargue - Rocky Mountain Cloudscape',
      url: 'bewly://assets/wallpapers/rocky-mountain-cloudscape.jpg',
      thumbnail: 'bewly://assets/wallpapers/rocky-mountain-cloudscape-thumbnail.jpg',
    },
    {
      name: 'Zongnan Bao- Green white mountains',
      url: 'bewly://assets/wallpapers/green-white-mountains.jpg',
      thumbnail: 'bewly://assets/wallpapers/green-white-mountains-thumbnail.jpg',
    },
    {
      name: 'Colin Watts - Night Sky Stars',
      url: 'bewly://assets/wallpapers/night-sky-stars.jpg',
      thumbnail: 'bewly://assets/wallpapers/night-sky-stars-thumbnail.jpg',
    },
    {
      name: 'Ryan Geller - Sailboats moored at Land and Sea Park in The Exumas',
      url: 'bewly://assets/wallpapers/sailboats-moored-at-the-exumas.jpg',
      thumbnail: 'bewly://assets/wallpapers/sailboats-moored-at-the-exumas-thumbnail.jpg',
    },
    {
      name: 'NASA - Outer Space Photo',
      url: 'bewly://assets/wallpapers/outer-space-photo.jpg',
      thumbnail: 'bewly://assets/wallpapers/outer-space-photo-thumbnail.jpg',
    },
    {
      name: 'BML2019 VR (pid: 74271400)',
      url: 'bewly://assets/wallpapers/bml2019-vr.jpg',
      thumbnail: 'bewly://assets/wallpapers/bml2019-vr-thumbnail.jpg',
    },
    {
      name: '2020 拜年祭活动',
      url: 'bewly://assets/wallpapers/2020-拜年祭活动.jpg',
      thumbnail: 'bewly://assets/wallpapers/2020-拜年祭活动-thumbnail.jpg',
    },
    {
      name: '2020 BDF',
      url: 'bewly://assets/wallpapers/2020-bdf.jpg',
      thumbnail: 'bewly://assets/wallpapers/2020-bdf-thumbnail.jpg',
    },
  ]
})

function getBewlyImage(filePath: string) {
  if (filePath.includes('bewly://'))
    return browser.runtime.getURL(filePath.replace('bewly://', '/'))
  return filePath
}

interface BewlyWallpaper {
  searchBarCharacters: ComputedRef<{ name: string, url: string }[]>
  wallpapers: ComputedRef<{ name: string, url: string, thumbnail: string }[]>
  getBewlyImage: (filePath: string) => string
}

export function useBewlyImage(): BewlyWallpaper {
  return {
    searchBarCharacters,
    wallpapers,
    getBewlyImage,
  }
}
