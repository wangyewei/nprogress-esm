export const isHTMLElement = (val: unknown): val is HTMLElement =>
  val instanceof HTMLElement

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
