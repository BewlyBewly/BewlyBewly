import { settings } from '~/logic'

// DISABLED WHEN IN TOUCHSCREEN OPTIMIZATION IS ENABLED IN SETTINGS
export function useDelayedHover({ enterDelay = 300, leaveDelay = 300, beforeEnter, enter, beforeLeave, leave }:
{ enterDelay?: number, leaveDelay?: number, beforeEnter?: Function, enter: Function, beforeLeave?: Function, leave: Function }) {
  const el = ref<HTMLElement>()

  let enterTimer: any | undefined
  let leaveTimer: any | undefined

  function handleMouseEnter() {
    if (beforeEnter)
      beforeEnter()

    if (enterTimer) {
      clearTimeout(enterTimer)
      enterTimer = undefined
    }
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
    enterTimer = setTimeout(() => {
      enter()
    }, enterDelay)
  }
  function handleMouseLeave() {
    if (beforeLeave)
      beforeLeave()

    if (enterTimer) {
      clearTimeout(enterTimer)
      enterTimer = undefined
    }
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
    leaveTimer = setTimeout(() => {
      leave()
    }, leaveDelay)
  }

  watch(el, (el, _, onCleanup) => {
    if (el) {
      if (!settings.value.touchScreenOptimization) {
        el.addEventListener('mouseenter', handleMouseEnter)
        el.addEventListener('mouseleave', handleMouseLeave)
      }
    }

    onCleanup(() => {
      if (el) {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      }
    })
  }, { flush: 'post' })

  watch(() => settings.value.touchScreenOptimization, (newValue) => {
    if (newValue) {
      el.value?.removeEventListener('mouseenter', handleMouseEnter)
      el.value?.removeEventListener('mouseleave', handleMouseLeave)
    }
    else {
      el.value?.addEventListener('mouseenter', handleMouseEnter)
      el.value?.addEventListener('mouseleave', handleMouseLeave)
    }
  }, { immediate: true })

  return el
}
