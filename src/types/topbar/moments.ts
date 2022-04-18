export enum MomentType {
  Video = 8,
  Article = 64,
  Bangumi = 512,
  PGC = 4097,
  Movie = 4098,
  TvShow = 4099,
  ChineseAnime = 4100,
  Documentary = 4101,
}

export interface MomentItem {
  type?: MomentType
  id: number
  uid: number
  name: string
  face: string
  aid?: number
  bvid?: string
  episode_id?: number
  url: string
  ctime?: number
  title: string
  cover: string
  dynamic_id_str?: string
  isNew: boolean
}
