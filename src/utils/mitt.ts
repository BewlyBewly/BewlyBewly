import type { Emitter } from 'mitt'
import mitt from 'mitt'

const emitter: Emitter<any> = mitt()
export default emitter
