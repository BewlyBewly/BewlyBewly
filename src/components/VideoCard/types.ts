export interface Video {
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
