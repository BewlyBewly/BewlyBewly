export interface ProfileCardInfo {
  archive_count: number
  article_count: number
  follower: number
  following: boolean
  like_num: number

  card: UserCard
  space: UserSpace
}

export interface ProfileCardInfoResult {
  code: number
  message: string
  ttl: number
  data: ProfileCardInfo
}

interface UserSpace {
  l_img: string
  s_img: string
}

interface UserCard {
  mid: string
  name: string
  approve: boolean
  sex: string
  rank: string
  face: string
  face_nft: number
  face_nft_type: number
  DisplayRank: string
  regtime: number
  spacesta: number
  birthday: string
  place: string
  description: string
  article: number
  attentions: any[]
  fans: number
  friend: number
  attention: number
  sign: string
  level_info: Levelinfo
  pendant: Pendant
  nameplate: Nameplate
  Official: Official
  official_verify: Officialverify
  vip: Vip
  is_senior_member: number
}

interface Vip {
  type: number
  status: number
  due_date: number
  vip_pay_type: number
  theme_type: number
  label: Label
  avatar_subscript: number
  nickname_color: string
  role: number
  avatar_subscript_url: string
  tv_vip_status: number
  tv_vip_pay_type: number
  tv_due_date: number
  vipType: number
  vipStatus: number
}

interface Label {
  path: string
  text: string
  label_theme: string
  text_color: string
  bg_style: number
  bg_color: string
  border_color: string
  use_img_label: boolean
  img_label_uri_hans: string
  img_label_uri_hant: string
  img_label_uri_hans_static: string
  img_label_uri_hant_static: string
}

interface Officialverify {
  type: number
  desc: string
}

interface Official {
  role: number
  title: string
  desc: string
  type: number
}

interface Nameplate {
  nid: number
  name: string
  image: string
  image_small: string
  level: string
  condition: string
}

interface Pendant {
  pid: number
  name: string
  image: string
  expire: number
  image_enhance: string
  image_enhance_frame: string
  n_pid: number
}

interface Levelinfo {
  current_level: number
  current_min: number
  current_exp: number
  next_exp: number
}
