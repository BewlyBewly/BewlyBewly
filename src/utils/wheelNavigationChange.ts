function handleWheelNavigationChange(event: WheelEvent, list: any[], activeItem: string, setActiveItem: (item: any) => void) {
  event.preventDefault() // 阻止浏览器默认的滚动行为
  // const currentIndex = list.findIndex(item => item.value === activeItem.value || item.page === activeItem.value)
  const currentIndex = list.findIndex(item => item.value === activeItem || item.page === activeItem)
  // console.log(list, currentIndex, activeItem)
  if (event.deltaY < 0) {
    // Scroll up
    const newItem = list[(currentIndex - 1 + list.length) % list.length]
    // console.log('newItem:', (currentIndex - 1 + list.length) % list.length)
    setActiveItem(newItem)
  }
  else {
    // Scroll down
    const newItem = list[(currentIndex + 1) % list.length]
    // console.log('newItem:', (currentIndex + 1) % list.length)
    setActiveItem(newItem)
  }
}
export default handleWheelNavigationChange
