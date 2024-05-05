export interface VideoCardProps {
  id: number
  skeleton?: boolean
  duration?: number
  durationStr?: string
  title: string
  desc?: string
  cover: string
  author?: string
  authorFace?: string
  /** If you set the `authorUrl`, clicking the author's name or avatar will navigate to this url  */
  authorUrl?: string
  mid?: number
  view?: number
  viewStr?: string
  danmaku?: number
  danmakuStr?: string
  publishedTimestamp?: number
  capsuleText?: string
  bvid?: string
  aid?: number
  uri?: string
  /** If you want to show preview video, you should set the cid value */
  cid?: number
  epid?: number
  followed?: boolean
  horizontal?: boolean
  tag?: string
  rank?: number
  topRightContent?: boolean
  showPreview?: boolean
  moreBtn?: boolean
  moreBtnActive?: boolean
  removed?: boolean
  type?: 'horizontal' | 'vertical' | 'bangumi'
}
