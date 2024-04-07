export function useDelayedHover({ delay = 200, enter, leave }: { delay?: number, enter: Function, leave: Function }) {
  const el = ref<HTMLElement>()

  let timer: any | undefined
  function handleMouseEnter() {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
    timer = setTimeout(() => {
      enter()
    }, delay)
  }
  function handleMouseLeave() {
    if (timer) {
      leave()
      clearTimeout(timer)
      timer = undefined
    }
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
