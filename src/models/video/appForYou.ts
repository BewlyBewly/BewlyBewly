// https://app.quicktype.io/?l=ts

export interface AppForYouResult {
  code: number
  message: string
  ttl: number
  data: Data
}

export interface Data {
  items: Item[]
  config: Config
  interest_choose: null
}

export interface Config {
  column: number
  autoplay_card: number
  feed_clean_abtest: number
  home_transfer_test: number
  auto_refresh_time: number
  show_inline_danmaku: number
  toast: ToastClass
  ipad_hd_abtest: number
  is_back_to_homepage: boolean
  enable_rcmd_guide: boolean
  auto_refresh_time_by_appear: number
  auto_refresh_time_by_active: number
  trigger_loadmore_left_line_num: number
  history_cache_size: number
  visible_area: number
  card_density_exp: number
  small_cover_wh_ratio: number
  space_enlarge_exp: number
  story_mode_v2_guide_exp: number
}

export interface ToastClass {
}

export interface Item {
  card_type: CardType
  card_goto: CardGoto
  args: Args
  idx: number
  track_id: TrackID
  hash?: string
  banner_item?: BannerItem[]
  goto?: CardGoto
  param?: string
  bvid?: string
  cover?: string
  title?: string
  uri?: string
  three_point?: ThreePoint
  player_args?: PlayerArgs
  mask?: Mask
  three_point_v2?: ThreePointV2[]
  report_flow_data?: string
  avatar?: Avatar
  cover_badge?: string
  cover_left_text_1?: string
  cover_left_text_2?: string
  desc?: string
  can_play?: number
  cover_right_text?: string
  cover_left_icon_1?: number
  cover_left_icon_2?: number
  ad_info?: AdInfo
  top_rcmd_reason?: string
  top_rcmd_reason_style?: RcmdReasonStyle
  bottom_rcmd_reason?: string
  official_icon?: number
  bottom_rcmd_reason_style?: RcmdReasonStyle
}

export interface AdInfo {
  creative_id: number
  creative_type: number
  card_type: number
  creative_content: CreativeContent
  ad_cb: string
  resource: number
  source: number
  request_id: string
  is_ad: boolean
  cm_mark: number
  index: number
  is_ad_loc: boolean
  card_index: number
  client_ip: string
  extra: Extra
  creative_style: number
}

export interface CreativeContent {
  title: string
  description: string
  image_url: string
  image_md5: string
  url: string
  click_url: string
}

export interface Extra {
  abtest: string
  act_img: string
  ad_content_type: number
  appstore_priority: number
  appstore_url: string
  bg_img: string
  card: Card
  click_area: number
  click_urls: string[]
  download_url_type: number
  download_whitelist: any[]
  enable_auto_callup: number
  enable_double_jump: boolean
  enable_h5_alert: boolean
  enable_h5_pre_load: number
  enable_store_direct_launch: number
  external_link_warning: string
  feedback_panel_style: number
  from_track_id: TrackID
  h5_pre_load_url: string
  hot_activity_id: number
  landingpage_download_style: number
  layout: string
  macro_replace_priority: number
  open_whitelist: any[]
  preload_landingpage: number
  product_id: number
  report_time: number
  sales_type: number
  shop_id: number
  show_1s_urls: any[]
  show_urls: any[]
  special_industry: boolean
  special_industry_style: number
  special_industry_tips: string
  store_callup_card: boolean
  store_dplink_xiaomi: string
  top_live_stay_time_seconds: number
  track_id: string
  up_mid: number
  upzone_entrance_report_id: number
  upzone_entrance_type: number
  use_ad_web_v2: boolean
}

export interface Card {
  ad_tag: string
  ad_tag_style: AdTagStyle
  adver: Adver
  adver_account_id: number
  adver_logo: string
  adver_mid: number
  adver_name: string
  adver_page_url: string
  anim_in_enable: number
  callup_url: string
  card_style: number
  card_type: number
  covers: Cover[]
  desc: string
  download_area: number
  duration: string
  dynamic_text: string
  extra_desc: string
  extreme_team_icon: string
  extreme_team_status: boolean
  feedback_panel: FeedbackPanel
  fold_time: number
  goods_cur_price: string
  goods_item_id: number
  goods_ori_price: string
  goods_panel_show: number
  goods_pannel_show: number
  grade_denominator: number
  grade_level: number
  imax_landing_page_v2: string
  jump_url: string
  live_auto_play: boolean
  live_booking_population_threshold: number
  live_room_area: string
  live_room_popularity: number
  live_room_title: string
  live_streamer_face: string
  live_streamer_name: string
  live_tag_show: boolean
  long_desc: string
  ori_mark_hidden: number
  ott_jump_url: string
  price_desc: string
  price_symbol: string
  quality_infos: QualityInfo[]
  show_pop_window: number
  star_level: number
  story_interaction_style: number
  support_transition: boolean
  title: string
  transition: string
  under_player_interaction_style: number
  underframe_card_style: number
  universal_app: string
  use_multi_cover: boolean
  yellow_cart_pannel_pullup: number
  yellow_cart_pannel_version: number
}

export interface AdTagStyle {
  bg_border_color: string
  bg_color: string
  bg_color_night: string
  border_color: string
  border_color_night: string
  img_height: number
  img_url: string
  img_width: number
  text: string
  text_color: string
  text_color_night: string
  type: number
}

export interface Adver {
  adver_desc: string
  adver_id: number
  adver_logo: string
  adver_name: string
  adver_page_url: string
  adver_type: number
}

export interface Cover {
  gif_tag_show: boolean
  gif_url: string
  image_height: number
  image_width: number
  loop: number
  url: string
}

export interface FeedbackPanel {
  close_rec_tips: string
  feedback_panel_detail: FeedbackPanelDetail[]
  open_rec_tips: string
  panel_type_text: string
  toast: string
}

export interface FeedbackPanelDetail {
  icon_url: string
  jump_type: number
  jump_url: string
  module_id: number
  secondary_panel?: SecondaryPanel[]
  sub_text: string
  text: string
}

export interface SecondaryPanel {
  reason_id: number
  text: string
}

export interface QualityInfo {
  bg_color: string
  bg_color_night: string
  bg_style: number
  border_color: string
  border_color_night: string
  icon_night: string
  is_bg: boolean
  text: string
  text_color: string
  text_color_night: string
  user_faces: string[]
}

export enum TrackID {
  All49RouterPegasus13486736F5B8C7B6W6Blj1701596425847856 = 'all_49.router-pegasus-1348673-6f5b8c7b6-w6blj.1701596425847.856',
}

export interface Args {
  up_id?: number
  up_name?: string
  rid?: number
  rname?: string
  aid?: number
}

export interface Avatar {
  cover: string
  uri: string
  event: AvatarEvent
  event_v2: AvatarEventV2
  up_id: number
  text?: string
}

export enum AvatarEvent {
  UpClick = 'up_click',
}

export enum AvatarEventV2 {
  UpClick = 'up-click',
}

export interface BannerItem {
  id: number
  title: string
  image: string
  hash: string
  uri: string
  request_id: string
  src_id: number
  is_ad_loc: boolean
  client_ip: string
  server_type: number
  resource_id: number
  index: number
  cm_mark: number
}

export interface RcmdReasonStyle {
  text: string
  text_color: string
  bg_color: string
  border_color: string
  text_color_night: string
  bg_color_night: string
  border_color_night: string
  bg_style: number
}

export enum CardGoto {
  AV = 'av',
  AdWebS = 'ad_web_s',
  Banner = 'banner',
  Bangumi = 'bangumi',
}

export enum CardType {
  BannerIpadV8 = 'banner_ipad_v8',
  CMV1 = 'cm_v1',
  LargeCoverV1 = 'large_cover_v1',
}

export interface Mask {
  avatar: Avatar
  button: Button
}

export interface Button {
  text: Text
  param: string
  event: ButtonEvent
  type: number
  event_v2: ButtonEventV2
  selected?: number
}

export enum ButtonEvent {
  UpFollow = 'up_follow',
}

export enum ButtonEventV2 {
  UpFollow = 'up-follow',
}

export enum Text {
  关注 = '+ 关注',
}

export interface PlayerArgs {
  aid: number
  cid: number
  type: CardGoto
  duration: number
}

export interface ThreePoint {
  dislike_reasons: DislikeReason[]
  feedbacks?: DislikeReason[]
  watch_later?: number
}

export interface DislikeReason {
  id: number
  name: string
  toast: ToastEnum
}

export enum ToastEnum {
  将优化首页此类内容 = '将优化首页此类内容',
  将减少相似内容推荐 = '将减少相似内容推荐',
}

export interface ThreePointV2 {
  title: Title
  type: Type
  icon?: string
  subtitle?: Subtitle
  reasons?: DislikeReason[]
  id?: number
}

export enum Subtitle {
  选择后将优化首页此类内容 = '(选择后将优化首页此类内容)',
  选择后将减少相似内容推荐 = '(选择后将减少相似内容推荐)',
}

export enum Title {
  不感兴趣 = '不感兴趣',
  反馈 = '反馈',
  我不想看 = '我不想看',
  添加至稍后再看 = '添加至稍后再看',
}

export enum Type {
  Dislike = 'dislike',
  Feedback = 'feedback',
  WatchLater = 'watch_later',
}
