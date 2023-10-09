import type { AppPage } from '~/enums/appEnums'

export interface DockItem {
  label: string
  icon: string
  page: AppPage
}
