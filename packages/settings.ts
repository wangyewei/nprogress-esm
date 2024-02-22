import type { DightEnum } from './utils/typed'

export type Minimum = DightEnum<101>
export type ProgressSetting = {
  primaryColor: string
  minimum: Minimum
  easing: 'linear' | string
  positionUsing: string
  speed: number
  trickle: boolean
  trickleSpeed: number
  showSpinner: boolean
  barSelector: string
  spinnerSelector: string
  parent: string
  template: string
}

export const DEFAULT_SETTINGS: ProgressSetting = {
  primaryColor: '#29d',
  minimum: 1,
  easing: 'linear',
  positionUsing: '',
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  showSpinner: true,
  barSelector: '[role="bar"]',
  spinnerSelector: '[role="spinner"]',
  parent: 'body',
  template:
    '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
}
