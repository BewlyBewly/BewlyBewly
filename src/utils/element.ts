export function getShadowRoot(v: Element) {
  if (v.shadowRoot)
    return v.shadowRoot
}

export function findLeafActiveElement(doc: DocumentOrShadowRoot): Element | undefined {
  const active = doc?.activeElement
  if (!active)
    return

  const shadowRoot = getShadowRoot(active)
  if (shadowRoot && shadowRoot.activeElement)
    return findLeafActiveElement(shadowRoot)

  return active
}
