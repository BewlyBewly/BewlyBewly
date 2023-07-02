import mitt from 'mitt'
import type { Emitter } from 'mitt'

const emitter: Emitter<any> = mitt()
export default emitter
