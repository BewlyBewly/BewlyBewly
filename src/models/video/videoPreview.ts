export interface VideoPreviewResult {
  code: number
  message: string
  ttl: number
  data: Data
}

export interface Data {
  from: string
  result: string
  message: string
  quality: number
  format: string
  timelength: number
  accept_format: string
  accept_description: string[]
  accept_quality: number[]
  video_codecid: number
  seek_param: string
  seek_type: string
  durl: Durl[]
  support_formats: SupportFormat[]
  high_format: null
  volume: Volume
  last_play_time: number
  last_play_cid: number
}

export interface Durl {
  order: number
  length: number
  size: number
  ahead: string
  vhead: string
  url: string
  backup_url: null
}

export interface SupportFormat {
  quality: number
  format: string
  new_description: string
  display_desc: string
  superscript: string
  codecs: null
}

export interface Volume {
  measured_i: number
  measured_lra: number
  measured_tp: number
  measured_threshold: number
  target_offset: number
  target_i: number
  target_tp: number
}
