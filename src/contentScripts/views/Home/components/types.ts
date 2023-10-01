export interface VideoModel {
  id: number
  bvid: string
  owner: {
    face: string
    mid: number
    name: string
  }
  is_followed: boolean
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
  card_type: string
  card_goto: string
  goto: string
  param: string
  bvid: string
  cover: string
  title: string
  uri: string
  three_point: {
    dislike_reasons: {
      id: number
      name: string
      toast: string
    }[]

    feedbacks: {
      id: number
      name: string
      toast: string
    }[]

    watch_later: number
  }
  args: {
    up_id: number
    up_name: string
    rid: number
    rname: string
    aid: number
  }
  player_args: {
    aid: number
    cid: number
    type: string
    duration: number
  }
  idx: number
  mask: {
    avatar: {
      cover: string
      text: string
      uri: string
      event: string
      event_v2: string
      up_id: number
    }
    button: {
      text: string
      param: string
      event: string
      type: number
      event_v2: string
    }
  }
  three_point_v2: {
    title: string
    icon?: string
    subtitle: string
    reasons: {
      id: number
      name: string
      toast: string
    }[]

    type: string
  }[]

  track_id: string
  report_flow_data: string
  avatar: {
    cover: string
    uri: string
    event: string
    event_v2: string
    up_id: number
  }
  cover_left_text_1: string
  cover_left_text_2: string
  desc: string
  can_play: number
  cover_right_text: string
  cover_left_icon_1: number
  cover_left_icon_2: number
}
