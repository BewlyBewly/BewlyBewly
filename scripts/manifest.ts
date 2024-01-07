import fs from 'fs-extra'
import { getManifest } from '../src/manifest'
import { isFirefox, log, r } from './utils'

export async function writeManifest() {
  await fs.writeJSON(r(isFirefox ? 'extension-firefox/manifest.json' : 'extension/manifest.json'), await getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}

writeManifest()
