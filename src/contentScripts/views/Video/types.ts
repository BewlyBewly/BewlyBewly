// https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/video/info.md#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AFweb%E7%AB%AF
export interface VideoInfoModel {
  bvid: string
  aid: number
  videos: number
  tid: number
  tname: string
  copyright: number
  pic: string
  title: string
  pubdate: number
  ctime: number
  desc: string
  desc_v2: [
    {
      raw_text: string
      type: number
      biz_id: number
    },
  ]
  state: number
  duration: number
  mission_id: number
  rights: {
    bp: number
    elec: number
    download: number
    movie: number
    pay: number
    hd5: number
    no_reprint: number
    autoplay: number
    ugc_pay: number
    is_cooperation: number
    ugc_pay_preview: number
    no_background: number
    clean_mode: number
    is_stein_gate: number
    is_360: number
    no_share: number
    arc_pay: number
    free_watch: number
  }
  owner: {
    mid: number
    name: string
    face: string
  }
  staff: Array<{
    mid: number
    title: string
    name: string
    face: string
    follower: number
  }>
  stat: {
    aid: number
    view: number
    danmaku: number
    reply: number
    favorite: number
    coin: number
    share: number
    now_rank: number
    his_rank: number
    like: number
    dislike: number
    evaluation: string
    argue_msg: string
  }
  dynamic: string
  cid: number
  dimension: {
    width: number
    height: number
    rotate: number
  }
  season_id: number
  premiere: null
  teenage_mode: number
  is_chargeable_season: boolean
  is_story: false
  no_cache: boolean
  pages: Array<{
    cid: number
    page: number
    from: string
    part: string
    duration: number
    vid: string
    weblink: string
    dimension: {
      width: number
      height: number
      rotate: number
    }
    first_frame: string
  }>

  subtitle: {
    allow_submit: boolean
    list: string[]
  }
  ugc_season: {
    id: number
    title: string
    cover: string
    mid: number
    intro: string
    sign_state: number
    attribute: number
    sections: [
      {
        season_id: number
        id: number
        title: string
        type: number
        episodes: Array<{
          season_id: number
          section_id: number
          id: number
          aid: number
          cid: number
          title: string
          attribute: number
          arc: {
            aid: number
            videos: number
            type_id: number
            type_name: string
            copyright: number
            pic: string
            title: string
            pubdate: number
            ctime: number
            desc: string
            state: number
            duration: number
            rights: {
              bp: number
              elec: number
              download: number
              movie: number
              pay: number
              hd5: number
              no_reprint: number
              autoplay: number
              ugc_pay: number
              is_cooperation: number
              ugc_pay_preview: number
              arc_pay: number
              free_watch: number
            }
            author: {
              mid: number
              name: string
              face: string
            }
            stat: {
              aid: number
              view: number
              danmaku: number
              reply: number
              fav: number
              coin: number
              share: number
              now_rank: number
              his_rank: number
              like: number
              dislike: number
              evaluation: string
              argue_msg: string
            }
            dynamic: string
            dimension: {
              width: number
              height: number
              rotate: number
            }
            desc_v2: null
            is_chargeable_season: boolean
            is_blooper: boolean
          }
          page: {
            cid: number
            page: number
            from: string
            part: string
            duration: number
            vid: string
            weblink: string
            dimension: {
              width: number
              height: number
              rotate: number
            }
          }
          bvid: string
        }>
      },
    ]
    stat: {
      season_id: number
      view: number
      danmaku: number
      reply: number
      fav: number
      coin: number
      share: number
      now_rank: number
      his_rank: number
      like: number
    }
    ep_count: number
    season_type: number
    is_pay_season: boolean
  }
  is_season_display: boolean
  user_garb: {
    url_image_ani_cut: string
  }
  like_icon: string
  need_jump_bv: boolean
}
