import type { GridLayoutType } from '~/logic'

export enum HomeSubPage {
  ForYou = 'ForYou',
  Following = 'Following',
  SubscribedSeries = 'SubscribedSeries',
  Trending = 'Trending',
  Ranking = 'Ranking',
  Live = 'Live',
}

export interface RankingType {
  id: number
  name: string
  rid?: number
  seasonType?: number
  type?: string
}

export interface GridLayoutIcon {
  icon: string
  iconActivated: string
  value: GridLayoutType
}
