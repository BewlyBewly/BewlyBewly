export interface HistorySearchResult {
  code: number
  message: string
  ttl: number
  data: Data
}

export interface Data {
  has_more: boolean
  page: Page
  list: List[]
}

export interface List {
  title: string
  long_title: string
  cover: string
  covers: null
  uri: string
  history: History
  videos: number
  author_name: string
  author_face: string
  author_mid: number
  view_at: number
  progress: number
  badge: string
  show_title: ShowTitle
  duration: number
  total: number
  new_desc: NewDesc
  is_finish: number
  is_fav: number
  kid: number
  tag_name: string
  live_status: number
}

export interface History {
  oid: number
  epid: number
  bvid: string
  page: number
  cid: number
  part: string
  business: Business
  dt: number
}

export enum Business {
  Archive = 'archive',
}

export enum NewDesc {
  Empty = '',
  共2P = '共2P',
  共4P = '共4P',
}

export enum ShowTitle {
  Empty = '',
  JohnLennonOnceSaid = 'john lennon once said',
  The4K = '4K',
}

export interface Page {
  pn: number
  total: number
}
