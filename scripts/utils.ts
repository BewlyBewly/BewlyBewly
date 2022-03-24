import { resolve } from 'path'
import { bgCyan, black } from 'kolorist'

export const port = parseInt(process.env.PORT || '') || 3303
export const r = (...args: string[]) => resolve(__dirname, '..', ...args)
export const isDev = process.env.NODE_ENV !== 'production'

export function log(name: string, message: string) {
  // eslint-disable-next-line no-console
  console.log(black(bgCyan(` ${name} `)), message)
}
