export enum HomeSubPage {
  ForYou = 'ForYou',
  Following = 'Following',
  SubscribedSeries = 'SubscribedSeries',
  Trending = 'Trending',
  Ranking = 'Ranking',
}

export interface RankingType {
  id: number
  name: string
  rid?: number
  seasonType?: number
  type?: string
}
