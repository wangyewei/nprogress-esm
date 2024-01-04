import { DightEnum } from './utils/typed'
import { clamp, toBarPerc } from './utils/calc'
import { addClass, removeClass, css } from './utils/cls'
import { isHTMLElement } from './utils/is'
import { removeElement } from './utils/basic'
import { queue } from './utils/queue'

type Minimum = DightEnum<101>
export type NProgressSetting = {
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

const ELEMENT_ID = 'nprogress'

class NProgress {
  static settings: NProgressSetting = {
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

  static get isRendered(): boolean {
    return !!document.getElementById(ELEMENT_ID)
  }

  static status: number | null = null

  static isStared: boolean = typeof NProgress.status === 'number'

  static configure(options: Partial<NProgressSetting>) {
    const settings = NProgress.settings
    for (const key in options) {
      const value = options[key]
      if (value && Object.prototype.hasOwnProperty.call(options, key))
        settings[key] = value
    }
  }

  static set(n: Minimum) {
    const settings = NProgress.settings
    n = clamp<Minimum>(n, settings.minimum, 100)

    NProgress.status = n === 100 ? null : n

    const progress = NProgress.render(0)!
    const bar = progress?.querySelector<HTMLElement>(
      NProgress.settings.barSelector
    )!
    const speed = NProgress.settings.speed
    const ease = NProgress.settings.easing

    progress.offsetWidth /* Repaint */

    queue((next: Function) => {
      if (NProgress.settings.positionUsing === '') {
        NProgress.settings.positionUsing = NProgress.getPositionCss()
      }

      css(bar, this.barPositionCSS(n, speed, ease))

      if (n === 1) {
        // Fade out
        css(progress, {
          transition: 'none',
          opacity: 1,
        })
        progress.offsetWidth /* Repaint */

        setTimeout(function () {
          css(progress, {
            transition: `all ${speed}ms linear`,
            opacity: 0,
          })
          setTimeout(function () {
            NProgress.remove()
            next()
          }, speed)
        }, speed)
      } else {
        setTimeout(next, speed)
      }
    })
  }

  static render(from: Minimum) {
    if (NProgress.isRendered) return document.getElementById(ELEMENT_ID)

    addClass(document.documentElement, 'nprogress-busy')

    const progress = document.createElement('div')
    progress.id = ELEMENT_ID
    progress.innerHTML = NProgress.settings.template

    const bar = progress.querySelector<HTMLElement>(
      NProgress.settings.barSelector
    )!
    const perc = from ? '-100' : toBarPerc(NProgress.status || 0)
    const parent = isHTMLElement(NProgress.settings.parent)
      ? NProgress.settings.parent
      : (document.querySelector(NProgress.settings.parent) as HTMLElement)

    css(bar, {
      transition: 'all 0 linear',
      transform: `translate3d(${perc}%, 0, 0)`,
    })

    if (!NProgress.settings.showSpinner) {
      const spinner = document.querySelector<HTMLElement>(
        NProgress.settings.spinnerSelector
      )

      isHTMLElement(spinner) && removeElement(spinner)
    }

    if (parent !== document.body) {
      addClass(parent, 'nprogress-custom-parent')
    }

    parent.append(progress)
    return progress
  }

  static remove() {
    removeClass(document.documentElement, 'nprogress-busy')
    var parent = isHTMLElement(NProgress.settings.parent)
      ? NProgress.settings.parent
      : document.querySelector<HTMLElement>(NProgress.settings.parent)!
    removeClass(parent, 'nprogress-custom-parent')
    var progress = document.getElementById('nprogress')
    progress && removeElement(progress)
  }

  static getPositionCss(): 'translate3d' | 'translate' | 'margin' {
    const bodyStyle = document.body.style

    const vendorPrefix =
      'WebkitTransform' in bodyStyle
        ? 'Webkit'
        : 'MozTransform' in bodyStyle
        ? 'Moz'
        : 'msTransform' in bodyStyle
        ? 'ms'
        : 'OTransform' in bodyStyle
        ? 'O'
        : ''

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      return 'translate3d'
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      return 'translate'
    } else {
      return 'margin'
    }
  }

  static barPositionCSS(n: Minimum, speed: number, ease: string) {
    let barCSS: Record<string, any>

    if (NProgress.settings.positionUsing === 'translate3d') {
      barCSS = { transform: `translate3d(${toBarPerc(n)}%, 0, 0)` }
    } else if (NProgress.settings.positionUsing === 'translate') {
      barCSS = { transform: `translate(${toBarPerc(n)}%, 0)` }
    } else {
      barCSS = { 'margin-left': `${toBarPerc(n)}%` }
    }

    barCSS['transition'] = `all ${speed}ms ${ease}`

    return barCSS
  }
}

export default NProgress
