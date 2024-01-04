import { isFunction } from './is'

export const queue = (() => {
  const pendding: Function[] = []

  const next = () => {
    const fn = pendding.shift()
    isFunction(fn) && fn(next)
  }
  return (fn: Function) => {
    pendding.push(fn)
    if (pendding.length === 1) next()
  }
})()
