import fs from 'fs-extra'

import { getManifest } from '../src/manifest'
import { isFirefox, isSafari, log, r } from './utils'

export async function writeManifest() {
  await fs.writeJSON(r(
    isFirefox
      ? 'extension-firefox/manifest.json'
      : isSafari ? 'extension-safari/manifest.json' : 'extension/manifest.json',
  ), await getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}

writeManifest()
