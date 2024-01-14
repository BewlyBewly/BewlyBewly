import './common.scss'
import './comments.scss'
import './footer.scss'
import './modal.scss'
import './btn.scss'
import './userCard.scss'
import './videoPlayer.scss'

async function setupStyles() {
  const currentUrl = document.URL

  // homepage
  if (/https?:\/\/bilibili.com\/?$/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/?$/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/index.html$/.test(currentUrl)
    || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(currentUrl))
    await import('./homePage.scss')

  // notifications page
  else if (/https?:\/\/message.bilibili.com\.*/.test(currentUrl))
    await import('./notificationsPage.scss')

  // moments page
  else if (
    // moments
    /https?:\/\/t.bilibili.com\.*/.test(currentUrl)
    // moment detail
    || /https?:\/\/www.bilibili.com\/opus\/.*/.test(currentUrl))
    await import('./momentsPage.scss')

  // history page
  else if (/https?:\/\/(www.)?bilibili.com\/account\/history.*/.test(currentUrl))
    await import('./historyPage.scss')

  // user space page
  else if (/https?:\/\/space.bilibili.com\.*/.test(currentUrl))
    await import('./userSpacePage.scss')

  // search page
  else if (/https?:\/\/search.bilibili.com\.*/.test(currentUrl))
    await import('./searchPage.scss')

  // video page
  else if (
    /https?:\/\/(www.)?bilibili.com\/video\/.*/.test(currentUrl)
    // watch later playlist
    || /https?:\/\/(www.)?bilibili.com\/list\/watchlater.*/.test(currentUrl)
    // favorite playlist
    || /https?:\/\/(www.)?bilibili.com\/list\/ml.*/.test(currentUrl)
  )
    await import('./videoPage.scss')

  else if (
    // anime playback & movie page
    /https?:\/\/(www.)?bilibili.com\/bangumi\/play\/.*/.test(currentUrl)
  )
    await import('./animePlayback&MoviePage.scss')

  // anime page & chinese anime page
  else if (
    /https?:\/\/www.bilibili.com\/(anime|guochuang).*/.test(currentUrl))
    await import('./animePage.scss')

  // channel page e.g. tv shows, movie, variety shows, mooc page
  else if (
    /https?:\/\/(www.)?bilibili.com\/(tv|movie|variety|mooc|documentary).*/.test(currentUrl))
    await import('./channelPage.scss')

  // articles page
  else if (/https?:\/\/(www.)?bilibili.com\/read.*/.test(currentUrl))
    await import('./articlesPage.scss')
}

setupStyles()
