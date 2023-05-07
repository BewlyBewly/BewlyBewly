export interface WatchLaterModel {
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
  state: number
  duration: number
  mission_id: number
  rights: {}
  owner: {
    mid: number
    name: string
    face: string
  }
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
  }
  short_link_v2: string
  first_frame: string
  count: number
  cid: number
  progress: number
  add_at: number
  bvid: string
  uri: string
  viewed: boolean
  enable_vt: number
}
