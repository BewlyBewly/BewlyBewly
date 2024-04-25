import type { ComputedRef } from 'vue'

export const searchBarCharacters = computed((): { name: string, url: string }[] => {
  return [
    { name: '22 娘', url: 'bewly://assets/search-bar-characters/22chan_1.png' },
    { name: '33 娘', url: 'bewly://assets/search-bar-characters/33chan_1.png' },
    { name: '22 娘', url: 'bewly://assets/search-bar-characters/22chan_2.png' },
    { name: '33 娘', url: 'bewly://assets/search-bar-characters/33chan_2.png' },
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
      name: 'Nicolas Lafargue - Rocky Mountain Cloudscape',
      url: 'bewly://assets/wallpapers/Rocky Mountain Cloudscape.jpg',
      thumbnail: 'bewly://assets/wallpapers/Rocky Mountain Cloudscape.jpg',
    },
    {
      name: 'Zongnan Bao- Green white mountains',
      url: 'bewly://assets/wallpapers/Green white mountains.jpg',
      thumbnail: 'bewly://assets/wallpapers/Green white mountains.jpg',
    },
    {
      name: 'Colin Watts - Night Sky Stars',
      url: 'bewly://assets/wallpapers/Night Sky Stars.jpg',
      thumbnail: 'bewly://assets/wallpapers/Night Sky Stars.jpg',
    },
    {
      name: 'Ryan Geller - Sailboats moored at Land and Sea Park in The Exumas',
      url: 'bewly://assets/wallpapers/Sailboats moored at Land and Sea Park in The Exumas.jpg',
      thumbnail: 'bewly://assets/wallpapers/Sailboats moored at Land and Sea Park in The Exumas.jpg',
    },
    {
      name: 'NASA - Outer Space Photo',
      url: 'bewly://assets/wallpapers/Outer Space Photo.jpg',
      thumbnail: 'bewly://assets/wallpapers/Outer Space Photo.jpg',
    },
    {
      name: 'BML2019 VR (pid: 74271400)',
      url: 'bewly://assets/wallpapers/BML2019 VR.jpg',
      thumbnail: 'bewly://assets/wallpapers/BML2019 VR.jpg',
    },
    {
      name: '2020 拜年祭活动',
      url: 'bewly://assets/wallpapers/2020 拜年祭活动.jpg',
      thumbnail: 'bewly://assets/wallpapers/2020 拜年祭活动.jpg',
    },
    {
      name: '2020 BDF',
      url: 'bewly://assets/wallpapers/2020 BDF.jpg',
      thumbnail: 'bewly://assets/wallpapers/2020 BDF.jpg',
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
