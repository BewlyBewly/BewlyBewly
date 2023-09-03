import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, isFirefox, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: `${pkg.displayName || pkg.name}${isDev ? ' Dev' : ''}`,
    version: pkg.version,
    description: pkg.description,
    homepage_url: pkg.homepage,
    // action: {
    //   default_icon: './assets/icon-512.png',
    //   default_popup: './dist/popup/index.html',
    // },
    // options_ui: {
    //   page: './dist/options/index.html',
    //   open_in_tab: true,
    // },
    background: isFirefox
      ? { scripts: ['./dist/background/index.mjs'] }
      : { service_worker: './dist/background/index.mjs' },
    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png',
    },
    permissions: [
      'tabs',
      'storage',
      'scripting',
      'declarativeNetRequest',
    ],
    host_permissions: ['*://*.bilibili.com/*', '*://*.mcbbs.net/*'],
    content_scripts: [
      {
        matches: ['*://www.bilibili.com/*', '*://search.bilibili.com/*', '*://t.bilibili.com/*'],
        js: ['./dist/contentScripts/index.global.js'],
        run_at: 'document_start',
        match_about_blank: true,
      },
    ],
    web_accessible_resources: [
      {
        resources: ['dist/contentScripts/style.css', 'assets/*'],
        matches: ['<all_urls>'],
        // matches: ['./assets/*'],
      },
    ],
    content_security_policy: {
      extension_pages: isDev
        // this is required on dev for Vite script to load
        ? `script-src 'self' http://localhost:${port}; object-src 'self' http://localhost:${port}`
        : 'script-src \'self\'; object-src \'self\'',
    },
    // @ts-expect-error Manifest.WebExtensionManifest type doesn't not support declarative_net_request check
    declarative_net_request: {
      rule_resources: [{
        id: 'ruleset_1',
        enabled: true,
        path: 'assets/rules.json',
      }],
    },
  }

  if (isDev)
    manifest.permissions?.push('webNavigation')

  return manifest
}
