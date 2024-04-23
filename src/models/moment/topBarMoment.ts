// https://app.quicktype.io/?l=ts

export interface TopBarMomentResult {
  code: number
  message: string
  ttl: number
  data: Data
}

export interface Data {
  has_more: boolean
  items: Item[]
  offset: string
  update_baseline: string
  update_num: number
}

export interface Item {
  author: Author
  cover: string
  id_str: string
  jump_url: string
  pub_time: string
  rid: number
  title: string
  type: number
  visible: boolean
}

export interface Author {
  face: string
  jump_url: string
  mid: number
  name: string
  official: Official
  vip: Vip
}

export interface Official {
  desc: string
  role: number
  title: string
  type: number
}

export interface Vip {
  avatar_icon: AvatarIcon
  avatar_subscript: number
  avatar_subscript_url: string
  due_date: number
  label: Label
  nickname_color: Color
  role: number
  status: number
  theme_type: number
  tv_due_date: number
  tv_vip_pay_type: number
  tv_vip_status: number
  type: number
  vip_pay_type: number
}

export interface AvatarIcon {
  icon_resource: IconResource
  icon_type?: number
}

export interface IconResource {
  type?: number
  url?: string
}

export interface Label {
  bg_color: Color
  bg_style: number
  border_color: string
  img_label_uri_hans: string
  img_label_uri_hans_static: string
  img_label_uri_hant: string
  img_label_uri_hant_static: string
  label_theme: LabelTheme
  path: string
  text: Text
  text_color: TextColor
  use_img_label: boolean
}

export enum Color {
  Empty = '',
  Fb7299 = '#FB7299',
}

export enum LabelTheme {
  AnnualVip = 'annual_vip',
  Empty = '',
  Vip = 'vip',
}

export enum Text {
  Empty = '',
  大会员 = '大会员',
  年度大会员 = '年度大会员',
}

export enum TextColor {
  Empty = '',
  Ffffff = '#FFFFFF',
}
