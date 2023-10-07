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

  'basic': {
    'comment_id_str': string
    'comment_type': 1
    'like_icon': {
      'action_url': string
      'end_url': string
      'id': 0
      'start_url': string
    }
    'rid_str': string
  }
  'id_str': string
  'modules': {
    'module_author': {
      'avatar': {
        'container_size': {
          'height': 1.35
          'width': 1.35
        }
        'fallback_layers': {
          'is_critical_group': true
          'layers': [
            {
              'general_spec': {
                'pos_spec': {
                  'axis_x': 0.675
                  'axis_y': 0.675
                  'coordinate_pos': 2
                }
                'render_spec': {
                  'opacity': 1
                }
                'size_spec': {
                  'height': 1
                  'width': 1
                }
              }
              'layer_config': {
                'is_critical': true
                'tags': {
                  'AVATAR_LAYER': {}
                  'GENERAL_CFG': {
                    'config_type': 1
                    'general_config': {
                      'web_css_style': {
                        'borderRadius': '50%'
                      }
                    }
                  }
                }
              }
              'resource': {
                'res_image': {
                  'image_src': {
                    'placeholder': 6
                    'remote': {
                      'bfs_style': string
                      'url': string
                    }
                    'src_type': 1
                  }
                }
                'res_type': 3
              }
              'visible': true
            },
            {
              'general_spec': {
                'pos_spec': {
                  'axis_x': 0.8000000000000002
                  'axis_y': 0.8000000000000002
                  'coordinate_pos': 1
                }
                'render_spec': {
                  'opacity': 1
                }
                'size_spec': {
                  'height': 0.41666666666666663
                  'width': 0.41666666666666663
                }
              }
              'layer_config': {
                'tags': {
                  'GENERAL_CFG': {
                    'config_type': 1
                    'general_config': {
                      'web_css_style': {
                        'background-color': 'rgb(255,255,255)'
                        'border': '2px solid rgba(255,255,255,1)'
                        'borderRadius': '50%'
                        'boxSizing': 'border-box'
                      }
                    }
                  }
                  'ICON_LAYER': {}
                }
              }
              'resource': {
                'res_image': {
                  'image_src': {
                    'local': 4
                    'src_type': 2
                  }
                }
                'res_type': 3
              }
              'visible': true
            },
          ]
        }
        'mid': '928123'
      }
      'face': string
      'face_nft': false
      'following': true
      'jump_url': string
      'label': string
      'mid': 928123
      'name': string
      'official_verify': {
        'desc': string
        'type': 1
      }
      'pendant': {
        'expire': 0
        'image': string
        'image_enhance': string
        'image_enhance_frame': string
        'name': string
        'pid': 0
      }
      'pub_action': string
      'pub_location_text': string
      'pub_time': string
      'pub_ts': 1696609801
      'type': string
    }
    'module_dynamic': {
      'additional': null
      'desc': null
      'major': {
        'archive': {
          'aid': string
          'badge': {
            'bg_color': '#FB7299'
            'color': '#FFFFFF'
            'icon_url': null
            'text': '投稿视频'
          }
          'bvid': 'BV13w411y7E7'
          'cover': 'http://i0.hdslb.com/bfs/archive/15757cde3114b8f19d74ced14ba0694ce20ba1d8.png'
          'desc': '#14'
          'disable_preview': 0
          'duration_text': '23:37'
          'jump_url': '//www.bilibili.com/video/BV13w411y7E7/'
          'stat': {
            'danmaku': '16'
            'play': '2707'
          }
          'title': '【7月】主宰七魔剑 14【独家正版】'
          'type': 1
        }
        'type': 'MAJOR_TYPE_ARCHIVE'
      }
      'topic': null
    }
    'module_more': {
      'three_point_items': [
        {
          'label': string
          'type': string
        },
      ]
    }
    'module_stat': {
      'comment': {
        'count': 12
        'forbidden': false
      }
      'forward': {
        'count': 0
        'forbidden': false
      }
      'like': {
        'count': 250
        'forbidden': false
        'status': false
      }
    }
  }
  'type': 'DYNAMIC_TYPE_AV'
  'visible': true

}
