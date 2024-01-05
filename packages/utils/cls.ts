import { camelCase } from './basic'

const classList = (element: Element) =>
  (' ' + ((element && element.className) || '') + ' ').replace(/\s+/gi, ' ')

export const addClass = (element: Element, name: string) => {
  const oldList = classList(element)
  if (hasClass(oldList, name)) return
  element.classList.add(name)
}

export const removeClass = (element: Element, name: string) => {
  const oldList = classList(element)
  if (!hasClass(oldList, name)) return
  element.classList.remove(name)
}

export const hasClass = (element: string | Element, name: string) => {
  const list = typeof element === 'string' ? element : classList(element)
  return list.indexOf(' ' + name + ' ') >= 0
}

export const css = (() => {
  const cssPrefixes = ['Webkit', 'O', 'Moz', 'ms']
  const cssProps: Record<string, any> = {}

  const getVendorProp = (name: string) => {
    var style = document.body.style
    if (name in style) return name

    let i = cssPrefixes.length
    let capName = name.charAt(0).toUpperCase() + name.slice(1)
    while (i--) {
      const vendorName: keyof typeof style = (cssPrefixes[i] +
        capName) as keyof typeof style
      if (vendorName in style) return vendorName
    }

    return name
  }

  const getProp = (name: string) => {
    name = camelCase(name)
    return cssProps[name] || (cssProps[name] = getVendorProp(name))
  }

  const applyCss = (element: HTMLElement, prop: string, value: unknown) => {
    const styleName = getProp(prop) as keyof CSSStyleDeclaration
    ;(element.style as any)[styleName] = value
  }

  return (element: HTMLElement, properties: Record<string, any>) => {
    for (const prop in properties) {
      const value = properties[prop]
      if (value && Object.prototype.hasOwnProperty.call(properties, prop)) {
        applyCss(element, prop, value)
      }
    }
  }
})()
