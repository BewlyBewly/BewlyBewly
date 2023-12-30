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
