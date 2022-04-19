import { MomentType } from '~/types'
import { getUserID, getCookie, setCookie } from '~/utils'

/** Update the time interval of topbar notifications and moments counts */
export const updateInterval = 1000 * 60 * 5 // Updated every 5 minutes

const getVideoOffsetID = (): number => parseInt(`${getCookie(`bp_video_offset_${getUserID()}`)}`, 10) || 0
const getArticleOffsetID = (): number => parseInt(`${getCookie(`bp_article_offset_${getUserID()}`)}`, 10) || 0

const compareOffsetID = (currentOffsetID: number, lastestOffsetID: number): boolean => {
  if (currentOffsetID === lastestOffsetID)
    return false
  else if (currentOffsetID > lastestOffsetID)
    return true
  else
    return false
}

export const setLastestOffsetID = (type: MomentType, offsetID: number) => {
  if (offsetID === null || offsetID === undefined)
    return

  if (type === MomentType.Video || type === MomentType.Bangumi)
    setCookie(`bp_video_offset_${getUserID()}`, offsetID.toString(), 30)
  else if (type === MomentType.Article)
    setCookie(`bp_article_offset_${getUserID()}`, offsetID.toString(), 30)
}

export const isNewVideo = (currentOffsetID: number): boolean => compareOffsetID(currentOffsetID, getVideoOffsetID())
export const isNewArticle = (currentOffsetID: number): boolean => compareOffsetID(currentOffsetID, getArticleOffsetID())
