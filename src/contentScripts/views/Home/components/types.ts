export interface VideoModel {
  id: number
  bvid: string
  owner: {
    face: string
    mid: number
    name: string
  }
  pic: string
  pubdate: number
  stat: {
    danmaku: number
    like: number
    view: number
  }
  title: string
  uri: string
  duration: number
}

export interface AppVideoModel {
  title: string
  cover: string
  uri: string
  param: string
  goto: string
  desc: string
  play: number
  danmaku: number
  reply: number
  favorite: number
  coin: number
  share: number
  like: number
  duration: number
  rcmd_reason: {
    id: number
    content: string
    message: string
  }
  idx: number
  cid: number
  tid: number
  tname: string
  tag: {
    tag_id: number
    tag_name: string
  }
  dislike_reasons: { reason_id: number; reason_name: string }[]
  ctime: number
  autoplay: number
  mid: number
  name: string
  face: string
  is_atten: number
  autoplay_card: number
}
