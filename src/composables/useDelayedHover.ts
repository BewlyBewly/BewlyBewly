export function useDelayedHover({ enterDelay = 250, leaveDelay = 310, beforeEnter, enter, beforeLeave, leave }:
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
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    }

    onCleanup(() => {
      if (el) {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      }
    })
  }, { flush: 'post' })

  return el
}
