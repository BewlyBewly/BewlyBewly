import type { App, Plugin } from 'vue'

const paths: Record<string, { default: Component }> = import.meta.glob(['./*/*.vue', './*.vue', './OverlayScrollbarsComponent.ts'], { eager: true })

export default {
  install: (app: App) => {
    for (const path in paths) {
      const splitPath = path.split('/')
      const name = splitPath[splitPath.length - 1].replace('.vue', '').replace('.ts', '')
      app.component(name, paths[path].default)
    }
  },
} as Plugin
