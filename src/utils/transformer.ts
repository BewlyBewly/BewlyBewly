import type { MaybeElement } from '@vueuse/core'
import { unrefElement, useElementVisibility } from '@vueuse/core'
import type { CSSProperties } from 'vue'

interface TransformerCenter {
  x?: boolean
  y?: boolean
}

export interface Transformer {
  x: number | string
  y: number | string
  centerTarget?: TransformerCenter
  notrigger?: boolean
}

/**
 * Covert transform to top and left style, if no chromium, use transform
 * @param trigger
 * @param transformer
 */
export function createTransformer(trigger: Ref<MaybeElement>, transformer: Transformer) {
  const target = ref<MaybeElement>()
  const style = ref<CSSProperties>({})

  watch(trigger, () => {
    if (transformer.notrigger) {
      target.value = unrefElement(trigger)
    }
  }, { immediate: true })

  function update() {
    let x = '0px'
    let y = '0px'

    if (typeof transformer.x === 'number') {
      x = `${transformer.x}px`
    }
    else {
      x = transformer.x
    }

    if (typeof transformer.y === 'number') {
      y = `${transformer.y}px`
    }
    else {
      y = transformer.y
    }

    if (target.value && transformer.centerTarget) {
      const el = unrefElement(target.value)
      const targetRect = el!.getBoundingClientRect()

      if (transformer.centerTarget.x) {
        x = `calc(${transformer.x} - ${targetRect.width / 2}px)`
      }

      if (transformer.centerTarget.y) {
        y = `calc(${transformer.y} - ${targetRect.height / 2}px)`
      }
    }

    style.value = {
      transform: 'none !important',
      top: y,
      left: x,
    }

    //   // nothing, use inherit transform
    //   style.value = {
    //     transform: `translate3d(${x}, ${y}, 0) !important`,
    //   }
  }

  function generateStyle(originStyle: string | undefined | null): string {
    const s = (originStyle || '')
      .split(';')
      .map((item) => {
        const [key, value] = item.split(':').map(item => item.trim())

        if (!key || !value) {
          return {}
        }

        return {
          [key]: value,
        }
      })
      .reduce((acc, item) => {
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
  const targetVisibility = useElementVisibility(() => unrefElement(target))
  watch(targetVisibility, (visible) => {
    if (visible) {
      const targetElement = unrefElement(target)
      if (targetElement) {
        update()
        const style = targetElement.getAttribute('style')
        targetElement.setAttribute('style', generateStyle(style))
      }
    }
  }, { flush: 'pre' })

  // v-show
  // useEventListener(() => unrefElement(target), 'transitionstart', () => {
  //   update()
  //   const style = unrefElement(target)?.getAttribute('style')
  //   unrefElement(target)?.setAttribute('style', generateStyle(style))
  // })

  // useEventListener(() => unrefElement(target), 'transitionend', () => {
  //   const style = unrefElement(target)?.getAttribute('style')
  //   unrefElement(target)?.setAttribute('style', generateStyle(style))
  // })

  // v-if
  watch(() => unrefElement(target), (targetElement) => {
    if (targetElement) {
      update()
      const style = targetElement.getAttribute('style')
      targetElement.setAttribute('style', generateStyle(style))
    }
  }, { flush: 'pre' })

  return target
}
