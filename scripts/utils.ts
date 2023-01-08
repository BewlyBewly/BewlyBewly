import { resolve } from 'path'
import { bgCyan, black } from 'kolorist'

export const port = parseInt(process.env.PORT || '') || 3303
export const r = (...args: string[]) => resolve(__dirname, '..', ...args)
export const isDev = process.env.NODE_ENV !== 'production'
export const isWin = process.platform === 'win32'

export function log(name: string, message: string) {
  console.log(black(bgCyan(` ${name} `)), message)
}
