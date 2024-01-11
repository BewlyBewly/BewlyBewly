export default defineAsyncComponent(async () => {
  const { OverlayScrollbarsComponent } = await import('overlayscrollbars-vue')
  return OverlayScrollbarsComponent
})
