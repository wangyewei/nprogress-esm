import { type DightEnum } from './typed'

export const clamp = <T extends number = 100>(n: number, min: number, max: T) =>
  (n > max ? max : n < min ? min : n) as DightEnum<T>

export const toBarPerc = (n: number) => n - 100
