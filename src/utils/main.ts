/**
 * Get cookie by name
 * @param name cookie name
 * @returns cookie value
 */
export function getCookie(name: string): string {
  const value = `; ${document.cookie}`
  const parts: Array<string> = value.split(`; ${name}=`)
  if (parts.length === 2)
    return parts?.pop()?.split(';').shift() || ''
  return ''
}

/**
 * Set cookie
 * @param name cookie name
 * @param value cookie value
 */
export function setCookie(name: string, value: any, expDays: number) {
  const date = new Date()
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}; ${expires}; domain=.bilibili.com; path=/`
}

/**
 * Get current login user id
 * @returns userId
 */
export const getUserID = (): string => getCookie('DedeUserID')

/**
 * Get csrf token
 */
export const getCSRF = (): string => getCookie('bili_jct')

/**
 * Remove the 'http:' or 'https:' prefix from a URL
 * @param url
 * @returns The result of removing the 'http:' or 'https:' prefix from a url
 */
export function removeHttpFromUrl(url: string): string {
  return url.replace(/^https?:/, '')
}

export function openLinkToNewTab(url: string) {
  window.open(url, '_blank', 'noopener noreferrer')
}

/**
 * Convert a hex color value to RGBA, thanks ChatGPT 🫡
 * @param hex hex color value
 * @param alpha color opacity
 * @returns RGBA or RGB color string
 */
export function hexToRGBA(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)

  if (alpha)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`

  else
    return `rgb(${r}, ${g}, ${b})`
}

/**
 * Smooth scroll to the top of the html element
 */
export function scrollToTop(element: HTMLElement, targetScrollTop = 0 as number) {
  // cancel if already on top
  if (element.scrollTop === targetScrollTop)
    return

  element.scrollTo({
    top: targetScrollTop,
    behavior: 'smooth',
  })
}

export function injectCSS(css: string): HTMLStyleElement {
  const el = document.createElement('style')
  el.setAttribute('rel', 'stylesheet')
  el.textContent = css
  document.documentElement.appendChild(el)
  return el
}

/**
 * delay
 * @param ms milliseconds delay time
 */
export function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Check if the current page is the home page
 * @returns true if the current page is the home page
 */
export function isHomePage(): boolean {
  if (
    /https?:\/\/(?:www\.)?bilibili.com\/?(?:#\/?)?$/.test(location.href)
    // https://github.com/hakadao/BewlyBewly/issues/525 #525
    || /https?:\/\/(?:www\.)?bilibili.com\/?(?:\?.*)?$/.test(location.href)
    || /https?:\/\/(?:www\.)?bilibili.com\/index\.html$/.test(location.href)
    || /https?:\/\/(?:www\.)?bilibili.com\/\?spm_id_from=.*/.test(location.href)
  ) {
    return true
  }
  return false
}

/**
 * Compresses and resizes an image file.
 *
 * @param file - The image file to compress and resize.
 * @param maxWidth - The maximum width of the resized image.
 * @param maxHeight - The maximum height of the resized image.
 * @param quality - The quality of the compressed image (0-1).
 * @param callback - The callback function to execute with the compressed file.
 */
export function compressAndResizeImage(file: File, maxWidth: number, maxHeight: number, quality: number, callback: any) {
  // Create an Image object
  const img = new Image()

  // Create a FileReader to read the file
  const reader = new FileReader()
  reader.onload = function (e) {
    img.src = e.target?.result as string

    img.onload = function () {
      // Create a canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Calculate new size
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width)
          width = maxWidth
        }
      }
      else {
        if (height > maxHeight) {
          width = Math.round(width * maxHeight / height)
          height = maxHeight
        }
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      if (!ctx) {
        console.error('compressAndResizeImage => ctx is null')
        return
      }

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, width, height)

      // Compress the image
      canvas.toBlob((blob) => {
        // Create a new blob file
        const compressedFile = new File([blob as Blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        })

        // Execute the callback with the new compressed file
        callback(compressedFile)
      }, 'image/jpeg', quality)
    }
  }

  // Read the file as a Data URL (base64)
  reader.readAsDataURL(file)
}
