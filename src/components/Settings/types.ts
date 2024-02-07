export enum MenuType {
  General = 'General',
  Appearance = 'Appearance',
  SearchPage = 'SearchPage',
  Home = 'Home',
  Compatibility = 'Compatibility',
  About = 'About',
}

export interface MenuItem {
  value: MenuType
  title: string
  icon: string
  iconActivated: string
}

export const fontColorOptions = [
  'hsl(215 19% 98%)',
  'hsl(217 19% 10%)',
]
