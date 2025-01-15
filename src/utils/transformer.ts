import type { MaybeElement } from '@vueuse/core'
import { unrefElement, useEventListener } from '@vueuse/core'
import type { CSSProperties } from 'vue'

interface TransfromerCenter {
  x?: boolean
  y?: boolean
}

export interface Transfromer {
  x: number | string
  y: number | string
  centerTarget?: TransfromerCenter
  notrigger?: boolean
}

function checkChromium(): boolean {
  return navigator.userAgent.includes('Chrome')
}

/**
 * Covert transform to top and left style, if no chromium, use transform
 * @param transfromer
 */
export function createTransformer(trigger: Ref<MaybeElement>, transfromer: Transfromer) {
  const target = ref<MaybeElement>()
  const isChromium = checkChromium()
  const style = ref<CSSProperties>({})

  watch(trigger, () => {
    if (transfromer.notrigger) {
      target.value = unrefElement(trigger)
    }
  }, { immediate: true })

  function update() {
    let x = transfromer.x
    let y = transfromer.y

    if (target.value && transfromer.centerTarget && isChromium) {
      const el = unrefElement(target.value)
      const targetRect = el!.getBoundingClientRect()

      if (transfromer.centerTarget.x) {
        if (typeof transfromer.x === 'number') {
          x = `calc(${transfromer.x}px - ${targetRect.width / 2}px)`
        }
        else {
          x = `calc(${transfromer.x} - ${targetRect.width / 2}px)`
        }
      }

      if (transfromer.centerTarget.y) {
        if (typeof transfromer.y === 'number') {
          y = `calc(${transfromer.y}px - ${targetRect.height / 2}px)`
        }
        else {
          y = `calc(${transfromer.y} - ${targetRect.height / 2}px)`
        }
      }
    }

    if (isChromium) {
      style.value = {
        top: y,
        left: x,
      }
    }
    else {
      style.value = {
        transform: `translate(${x}, ${y})`,
        transformOrigin: transfromer.centerTarget ? 'center' : 'top left',
      }
    }
  }

  function generateStyle(originStyle: string | undefined | null): string {
    const s = (originStyle || '').split(';').map((item) => {
      const [key, value] = item.split(':')

      if (!key || !value) {
        return {}
      }

      return {
        [key.trim()]: value.trim(),
      }
    }).reduce((acc, item) => {
      return {
        ...acc,
        ...item,
      }
    }, {})

    for (const key in style.value) {
      // @ts-expect-error ignore
      s[key] = style.value[key]
    }

    return Object.keys(s).map(key => `${key}:${s[key]}`).join(';')
  }

  // v-show
  useEventListener(() => unrefElement(target), 'transitionstart', () => {
    update()
    const style = unrefElement(target)?.getAttribute('style')
    unrefElement(target)?.setAttribute('style', generateStyle(style))
  })

  useEventListener(() => unrefElement(target), 'transitionend', () => {
    const style = unrefElement(target)?.getAttribute('style')
    unrefElement(target)?.setAttribute('style', generateStyle(style))
  })

  // v-if
  watch(target, (target) => {
    update()
    const style = unrefElement(target)?.getAttribute('style')
    unrefElement(target)?.setAttribute('style', generateStyle(style))
  })

  return target
}
