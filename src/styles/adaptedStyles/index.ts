import './common/common.scss'
import './common/comments.scss'
import './common/footer.scss'
import './common/modal.scss'
import './common/btn.scss'
import './common/userCard.scss'
import './common/videoPlayer.scss'
import './common/loginDialog.scss'

import { isHomePage } from '~/utils/main'

async function setupStyles() {
  const currentUrl = document.URL

  // homepage 首页
  if (isHomePage()) {
    await import('./pages/homePage.scss')
    document.documentElement.classList.add('homePage')
  }

  // notifications page 消息页
  else if (/https?:\/\/message\.bilibili\.com\.*/.test(currentUrl)) {
    await import('./pages/notificationsPage.scss')
    document.documentElement.classList.add('notificationsPage')
  }

  // moments page, new articles page 动态页, 新版专栏页
  else if (
    // moments
    /https?:\/\/t\.bilibili\.com\.*/.test(currentUrl)
    // moment detail, new articles page
    || /https?:\/\/www\.bilibili\.com\/opus\/.*/.test(currentUrl)) {
    await import('./pages/momentsPage.scss')
    document.documentElement.classList.add('momentsPage')
  }

  // history page 历史记录页
  else if (/https?:\/\/(?:www\.)?bilibili\.com\/account\/history.*/.test(currentUrl)) {
    await import('./pages/historyPage.scss')
    document.documentElement.classList.add('historyPage')
  }

  // watch later page 稍候再看页
  else if (/https?:\/\/(?:www\.)?bilibili\.com\/watchlater\/#\/list.*/.test(currentUrl)) {
    await import('./pages/watchLaterPage.scss')
    document.documentElement.classList.add('watchLaterPage')
  }

  // user note page 笔记页
  else if (/https?:\/\/space.bilibili\.com\.*\/v\/note-list/.test(currentUrl)) {
    await import('./pages/notePage.scss')
    document.documentElement.classList.add('notePage')
  }

  // user space page 空间页
  else if (/https?:\/\/space.bilibili\.com\.*/.test(currentUrl)) {
    await import('./pages/userSpacePage.scss')
    document.documentElement.classList.add('userSpacePage')
  }

  // search page 搜索结果页
  else if (/https?:\/\/search.bilibili\.com\.*/.test(currentUrl)) {
    await import('./pages/searchPage.scss')
    document.documentElement.classList.add('searchPage')
  }

  // video page 视频页
  else if (
    /https?:\/\/(?:www\.)?bilibili\.com\/video\/.*/.test(currentUrl)
    // watch later playlist 稍候再看播放页
    || /https?:\/\/(?:www\.)?bilibili\.com\/list\/watchlater.*/.test(currentUrl)
    // favorite playlist 收藏播放页
    || /https?:\/\/(?:www\.)?bilibili\.com\/list\/ml.*/.test(currentUrl)
  ) {
    await import('./pages/videoPage.scss')
    document.documentElement.classList.add('videoPage')
  }

  else if (
    // anime playback & movie page 番剧播放页与电影播放页
    /https?:\/\/(?:www\.)?bilibili\.com\/bangumi\/play\/.*/.test(currentUrl)
  ) {
    await import('./pages/animePlayback&MoviePage.scss')
    document.documentElement.classList.add('animePlaybackAndMoviePage')
  }

  // anime page & chinese anime page 番剧页 与 国创动漫
  else if (
    /https?:\/\/(?:www\.)?bilibili\.com\/(?:anime|guochuang).*/.test(currentUrl)) {
    await import('./pages/animePage.scss')
    document.documentElement.classList.add('animePage')
  }

  // channel page e.g. tv shows, movie, variety shows & mooc pages 分区页
  else if (
    /https?:\/\/(?:www\.)?bilibili\.com\/(?:tv|movie|variety|mooc|documentary).*/.test(currentUrl)) {
    await import('./pages/channelPage.scss')
    document.documentElement.classList.add('channelPage')
  }

  // articles, articles list & articles ranking pages 专栏页, 专栏列表页, 专栏排行榜页
  else if (/https?:\/\/(?:www\.)?bilibili\.com\/read.*/.test(currentUrl)) {
    await import('./pages/articlesPage.scss')
    document.documentElement.classList.add('articlesPage')
  }

  // topic page 话题页
  else if (/https?:\/\/(?:www\.)?bilibili\.com\/v\/topic\/detail\/.*/.test(currentUrl)) {
    await import('./pages/topicPage.scss')
    document.documentElement.classList.add('topicPage')
  }

  // 404 page 404页
  else if (/^https?:\/\/(?:www\.)?bilibili\.com\/404.*$/.test(currentUrl)) {
    await import('./pages/error404Page.scss')
    document.documentElement.classList.add('error404Page')
  }

  // creative center page 创作中心页
  else if (/^https?:\/\/member\.bilibili\.com\/platform.*$/.test(currentUrl)) {
    await import('./forceDark.scss')
    document.documentElement.classList.add('forceDark')
    await import('./pages/creativeCenterPage.scss')
    document.documentElement.classList.add('creativeCenterPage')
  }

  // account settings page 帳戶設定頁
  else if (/^https?:\/\/account\.bilibili\.com\/.*$/.test(currentUrl)) {
    await import('./pages/accountSettingsPage.scss')
    document.documentElement.classList.add('accountSettingsPage')
  }

  // login page 登入頁
  else if (/^https?:\/\/passport\.bilibili\.com\/login.*$/.test(currentUrl)) {
    await import('./pages/loginPage.scss')
    document.documentElement.classList.add('loginPage')
  }
}

setupStyles()
