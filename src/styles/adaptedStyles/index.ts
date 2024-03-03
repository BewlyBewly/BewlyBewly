import './common.scss'
import './comments.scss'
import './footer.scss'
import './modal.scss'
import './btn.scss'
import './userCard.scss'
import './videoPlayer.scss'

async function setupStyles() {
  const currentUrl = document.URL

  // homepage 首页
  if (/https?:\/\/bilibili.com\/?$/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/?$/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/index.html$/.test(currentUrl)
    || /https?:\/\/bilibili.com\/\?spm_id_from=.*/.test(currentUrl)
    || /https?:\/\/www.bilibili.com\/\?spm_id_from=(.)*/.test(currentUrl)) {
    await import('./homePage.scss')
    document.documentElement.classList.add('homePage')
  }

  // notifications page 消息页
  else if (/https?:\/\/message.bilibili.com\.*/.test(currentUrl)) {
    await import('./notificationsPage.scss')
    document.documentElement.classList.add('notificationsPage')
  }

  // moments page 动态页
  else if (
    // moments
    /https?:\/\/t.bilibili.com\.*/.test(currentUrl)
    // moment detail
    || /https?:\/\/www.bilibili.com\/opus\/.*/.test(currentUrl)) {
    await import('./momentsPage.scss')
    document.documentElement.classList.add('momentsPage')
  }

  // history page 历史记录页
  else if (/https?:\/\/(www.)?bilibili.com\/account\/history.*/.test(currentUrl)) {
    await import('./historyPage.scss')
    document.documentElement.classList.add('historyPage')
  }

  // user space page 空间页
  else if (/https?:\/\/space.bilibili.com\.*/.test(currentUrl)) {
    await import('./userSpacePage.scss')
    document.documentElement.classList.add('userSpacePage')
  }

  // search page 搜索结果页
  else if (/https?:\/\/search.bilibili.com\.*/.test(currentUrl)) {
    await import('./searchPage.scss')
    document.documentElement.classList.add('searchPage')
  }

  // video page 视频页
  else if (
    /https?:\/\/(www.)?bilibili.com\/video\/.*/.test(currentUrl)
    // watch later playlist 稍候再看播放页
    || /https?:\/\/(www.)?bilibili.com\/list\/watchlater.*/.test(currentUrl)
    // favorite playlist 收藏播放页
    || /https?:\/\/(www.)?bilibili.com\/list\/ml.*/.test(currentUrl)
  ) {
    await import('./videoPage.scss')
    document.documentElement.classList.add('videoPage')
  }

  else if (
    // anime playback & movie page 番剧播放页与电影播放页
    /https?:\/\/(www.)?bilibili.com\/bangumi\/play\/.*/.test(currentUrl)
  ) {
    await import('./animePlayback&MoviePage.scss')
    document.documentElement.classList.add('animePlaybackAndMoviePage')
  }

  // anime page & chinese anime page 番剧页 与 国创动漫
  else if (
    /https?:\/\/(www.)?bilibili.com\/(anime|guochuang).*/.test(currentUrl)) {
    await import('./animePage.scss')
    document.documentElement.classList.add('animePage')
  }

  // channel page e.g. tv shows, movie, variety shows, mooc page 分区页
  else if (
    /https?:\/\/(www.)?bilibili.com\/(tv|movie|variety|mooc|documentary).*/.test(currentUrl)) {
    await import('./channelPage.scss')
    document.documentElement.classList.add('channelPage')
  }

  // articles page 专栏页
  else if (/https?:\/\/(www.)?bilibili.com\/read.*/.test(currentUrl)) {
    await import('./articlesPage.scss')
    document.documentElement.classList.add('articlesPage')
  }
}

setupStyles()
