import type { ThreePointV2 } from '~/models/video/appForYou'

export interface Video {
  id: number
  duration?: number
  durationStr?: string
  title: string
  desc?: string
  cover: string

  /** `author` for individual submissions by UP; `authorList` for collaborative submissions by UP */
  author?: Author | Author[]

  view?: number
  viewStr?: string
  danmaku?: number
  danmakuStr?: string

  publishedTimestamp?: number
  capsuleText?: string

  bvid?: string
  aid?: number
  // used for live
  roomid?: number
  epid?: number
  goto?: string
  /** After set the `url`, clicking the video will navigate to this url. It won't be affected by aid, bvid or epid */
  url?: string
  /** Better to provide cid, otherwise video preview will need to call another API to get it */
  cid?: number

  followed?: boolean
  liveStatus?: number

  tag?: string
  rank?: number
  type?: 'horizontal' | 'vertical' | 'bangumi'
  threePointV2: ThreePointV2[]

  badge?: {
    bgColor: string
    color: string
    iconUrl?: string
    text: string
  }
}

export interface Author {
  name?: string
  /** After set the `authorUrl`, clicking the author's name or avatar will navigate to this url. It won't be affected by mid */
  authorUrl?: string
  authorFace: string
  followed?: boolean | undefined
  mid?: number
}
