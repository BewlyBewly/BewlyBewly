interface Event {
  (e: MouseEvent): void
}

export function useDelayedHover({ enterDelay = 250, leaveDelay = 310, beforeEnter, enter, beforeLeave, leave }:
{ enterDelay?: number, leaveDelay?: number, beforeEnter?: Event, enter: Event, beforeLeave?: Event, leave: Event }) {
  const el = ref<HTMLElement>()

  let enterTimer: any | undefined
  let leaveTimer: any | undefined

  function handleMouseEnter(e: MouseEvent) {
    if (beforeEnter)
      beforeEnter(e)

    if (enterTimer) {
      clearTimeout(enterTimer)
      enterTimer = undefined
    }
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
    enterTimer = setTimeout(() => {
      enter(e)
    }, enterDelay)
  }
  function handleMouseLeave(e: MouseEvent) {
    if (beforeLeave)
      beforeLeave(e)

    if (enterTimer) {
      clearTimeout(enterTimer)
      enterTimer = undefined
    }
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
    leaveTimer = setTimeout(() => {
      leave(e)
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
