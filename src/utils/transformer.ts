import { type MaybeElementRef, useElementBounding } from '@vueuse/core'
import type { CSSProperties } from 'vue'

export interface Transfromer {
  x: number | string
  y: number | string
  center?: boolean
}

/**
 * Covert transform to top and left style, if no chromium, use transform
 * @param transfromer
 */
export function createTransformer(target: MaybeElementRef, transfromer: Transfromer, isChromium: boolean = true): Ref<CSSProperties> {
  const style = ref<CSSProperties>({})
  const rect = useElementBounding(target)

  watchEffect(() => {
    if (transfromer.center) {
      if (typeof transfromer.x === 'number') {
        transfromer.x = `calc(${transfromer.x}px - ${rect.width.value / 2}px)`
      }
      else {
        transfromer.x = `calc(${transfromer.x} - ${rect.width.value / 2}px)`
      }

      if (typeof transfromer.y === 'number') {
        transfromer.y = `calc(${transfromer.y}px - ${rect.height.value / 2}px)`
      }
      else {
        transfromer.y = `calc(${transfromer.y} - ${rect.height.value / 2}px)`
      }
    }

    const x = typeof transfromer.x === 'number' ? `${transfromer.x}px` : transfromer.x
    const y = typeof transfromer.y === 'number' ? `${transfromer.y}px` : transfromer.y

    if (isChromium) {
      style.value = {
        top: y,
        left: x,
      }
    }
    else {
      style.value = {
        transform: `translate(${x}, ${y})`,
        transformOrigin: transfromer.center ? 'center' : 'top left',
      }
    }
  })

  return style
}
