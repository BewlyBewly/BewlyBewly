export interface RecommendationResult {
  code: number
  data: Data
  message: string
}

export interface Data {
  coursor: number
  has_next: boolean
  items: Item[]
}

export interface Item {
  rank_id: number
  sub_items: ItemSubItem[]
  text: any[]
}

export interface ItemSubItem {
  card_style: string
  cover: string
  episode_id?: number
  evaluate?: string
  hover?: Hover
  inline?: Inline
  link?: string
  rank_id: number
  rating?: string
  rating_count?: number
  report: Report
  season_id?: number
  season_type?: number
  stat?: Stat
  sub_title: string
  text: any[]
  title: string
  user_status?: UserStatus
  sub_items?: SubItemSubItem[]
}

export interface Hover {
  img: string
  text: string[]
}

export interface Inline {
  end_time: number
  ep_id: number
  first_ep: number
  material_no: string
  scene: number
  start_time: number
}

export interface Report {
  first_ep?: number
  scene?: number
}

export interface Stat {
  danmaku: number
  duration: number
  view: number
}

export interface SubItemSubItem {
  card_style: string
  cover: string
  evaluate: string
  hover: Hover
  inline: Inline
  link: string
  rank_id: number
  rating?: string
  rating_count?: number
  report: Report
  season_id: number
  season_type: number
  stat: Stat
  sub_title: string
  text: any[]
  title: string
  user_status: UserStatus
}

export interface UserStatus {
  follow: number
}
