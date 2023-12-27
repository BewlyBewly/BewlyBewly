export interface TimetableResult {
  code: number
  message: string
  result: Result[]
}

export interface Result {
  date: string
  date_ts: number
  day_of_week: number
  episodes: Episode[]
  is_today: number
}

export interface Episode {
  cover: string
  delay: number
  delay_id: number
  delay_index: string
  delay_reason: string
  enable_vt: boolean
  ep_cover: string
  episode_id: number
  follow: number
  follows: string
  icon_font: IconFont
  plays: string
  pub_index: string
  pub_time: string
  pub_ts: number
  published: number
  season_id: number
  square_cover: string
  title: string
}

export interface IconFont {
  name: string
  text: string
}
