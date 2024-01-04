export const camelCase = (val: string) => {
  return val
    .replace(/^-ms-/, 'ms-')
    .replace(/-([\da-z])/gi, function (_, letter) {
      return letter.toUpperCase()
    })
}

export const removeElement = (element: HTMLElement) => {
  element && element.parentNode && element.parentNode.removeChild(element)
}
