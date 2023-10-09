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

export interface MomentModel {

  basic: {
    comment_id_str: string
    comment_type: number
    like_icon: {
      action_url: string
      end_url: string
      id: number
      start_url: string
    }
    rid_str: string
  }
  id_str: string
  modules: {
    module_author: {
      avatar: {
        container_size: {
          height: number
          width: number
        }
        fallback_layers: {
          is_critical_group: boolean
          layers: {
            general_spec: {
              pos_spec: {
                axis_x: number
                axis_y: number
                coordinate_pos: number
              }
              render_spec: {
                opacity: number
              }
              size_spec: {
                height: number
                width: number
              }
            }
            layer_config: {
              is_critical: true
              tags: {
                AVATAR_LAYER: object
                GENERAL_CFG: {
                  config_type: number
                  general_config: {
                    web_css_style: {
                      borderRadius: string
                    }
                  }
                }
              }
            }
            resource: {
              res_image: {
                image_src: {
                  placeholder: number
                  remote: {
                    bfs_style: string
                    url: string
                  }
                  src_type: number
                }
              }
              res_type: number
            }
            visible: boolean
          }[]
        }
        mid: string
      }
      face: string
      face_nft: boolean
      following: boolean
      jump_url: string
      label: string
      mid: number
      name: string
      official_verify: {
        desc: string
        type: number
      }
      pendant: {
        expire: number
        image: string
        image_enhance: string
        image_enhance_frame: string
        name: string
        pid: number
      }
      pub_action: string
      pub_location_text: string
      pub_time: string
      pub_ts: number
      type: string
    }
    module_dynamic: {
      additional?: string
      desc?: string
      major: {
        archive: {
          aid: string
          badge: {
            bg_color: string
            color: string
            icon_url?: string
            text: string
          }
          bvid: string
          cover: string
          desc: string
          disable_preview: number
          duration_text: string
          jump_url: string
          stat: {
            danmaku: string
            play: string
          }
          title: string
          type: number
        }
        type: string
      }
      topic?: any
    }
    module_more: {
      three_point_items: {
        label: string
        type: string
      }[]

    }
    module_stat: {
      comment: {
        count: number
        forbidden: boolean
      }
      forward: {
        count: number
        forbidden: boolean
      }
      like: {
        count: number
        forbidden: boolean
        status: boolean
      }
    }
  }
  type: string
  visible: boolean

}
