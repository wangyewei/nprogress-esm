import { clamp, toBarPerc } from './utils/calc'
import { addClass, removeClass, css } from './utils/cls'
import { isHTMLElement, isNumber } from './utils/is'
import { removeElement, generateUniqueHash, deepClone } from './utils/basic'
import { queue } from './utils/queue'
import {
  DEFAULT_SETTINGS,
  type ProgressSetting,
  type Minimum,
} from './settings'

const ELEMENT_ID = 'yev-progress'

class ProgressImpl {

  settings: ProgressSetting
  elementId: string

  constructor(settings?: ProgressSetting) {
    this.settings = settings || deepClone(DEFAULT_SETTINGS)
    this.elementId = ELEMENT_ID + '-' + generateUniqueHash()
  }

  get isRendered(): boolean {
    return !!document.getElementById(this.elementId)
  }

  get progressId(): string {
    return this.elementId
  }

  status: number | null = null
  isStared: boolean = typeof this.status === 'number'

  configure(options: Partial<ProgressSetting>) {
    const settings = this.settings
    for (const key in options) {
      const k = key as keyof ProgressSetting
      const value = options[k]
      if (value && Object.prototype.hasOwnProperty.call(options, key)) {
        ; (settings[k] as any) = value
      }
    }
  }

  set(n: Minimum) {
    const settings = this.settings
    n = clamp<Minimum>(n, settings.minimum, 100)

    this.status = n === 100 ? null : n

    const progress = this.render(+(this.status || 0) as Minimum)!
    const bar = progress?.querySelector<HTMLElement>(
      this.settings.barSelector
    )!
    const speed = this.settings.speed
    const ease = this.settings.easing

    progress.offsetWidth /* Repaint */

    queue((next: Function) => {
      if (this.settings.positionUsing === '') {
        this.settings.positionUsing = this.getPositionCss()
      }

      css(bar, this.barPositionCSS(n, speed, ease))

      if (n === 100) {
        // Fade out
        css(progress, {
          transition: 'none',
          opacity: 1,
        })
        progress.offsetWidth /* Repaint */

        setTimeout(() => {
          css(progress, {
            transition: `all ${speed}ms linear`,
            opacity: 0,
          })
          setTimeout(() => {
            this.remove()
            next()
          }, speed)
        }, speed)
      } else {
        setTimeout(next, speed)
      }
    })
  }

  start() {
    if (!this.status) this.set(0)
    const work = () => {
      setTimeout(() => {
        if (!this.status) return
        this.trickle()
        work()
      }, this.settings.trickleSpeed)
    }
    if (this.settings.trickle) work()
  }

  done() {
    this.set(100)
  }

  private render(from: Minimum) {
    if (this.isRendered) return document.getElementById(this.elementId)

    addClass(document.documentElement, 'yev-progress-busy')

    const progress = document.createElement('div')
    progress.id = this.elementId
    progress.classList.add('yev-progress')
    progress.innerHTML = this.settings.template

    document.documentElement.style.setProperty('--progress-primary-color', this.settings.primaryColor)

    const bar = progress.querySelector<HTMLElement>(
      this.settings.barSelector
    )!
    const perc = from ? toBarPerc(from) : '-100'

    const parent = isHTMLElement(this.settings.parent)
      ? this.settings.parent
      : (document.querySelector(this.settings.parent) as HTMLElement)

    css(bar, {
      transition: 'all 0 linear',
      transform: `translate3d(${perc}%, 0, 0)`,
    })

    if (!this.settings.showSpinner) {
      const spinner = document.querySelector<HTMLElement>(
        this.settings.spinnerSelector
      )

      isHTMLElement(spinner) && removeElement(spinner)
    }

    if (parent !== document.body) {
      addClass(parent, 'yev-progress-custom-parent')
    }

    parent.append(progress)
    return progress
  }

  inc(amount?: number | string) {
    let n: Minimum = +(this.status || 0) as Minimum
    if (!n) {
      return this.start()
    } else if (n > 100) {
      return
    } else {
      if (!isNumber(amount)) {
        if (n >= 0 && n < 20) {
          amount = 10
        } else if (n >= 20 && n < 50) {
          amount = 4
        } else if (n >= 50 && n < 80) {
          amount = 2
        } else if (n >= 80 && n < 100) {
          amount = 1
        } else {
          amount = 0
        }
      }

      n = clamp(n + amount, 0, 90)
      return this.set(n)
    }
  }

  remove() {
    removeClass(document.documentElement, 'yev-progress-busy')
    const parent = isHTMLElement(this.settings.parent)
      ? this.settings.parent
      : document.querySelector<HTMLElement>(this.settings.parent)!
    removeClass(parent, 'yev-progress-custom-parent')
    const progress = document.getElementById(this.elementId)
    progress && removeElement(progress)
  }

  private getPositionCss(): 'translate3d' | 'translate' | 'margin' {
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

  private barPositionCSS(n: Minimum, speed: number, ease: string) {
    let barCSS: Record<string, any>

    if (this.settings.positionUsing === 'translate3d') {
      barCSS = { transform: `translate3d(${toBarPerc(n)}%, 0, 0)` }
    } else if (this.settings.positionUsing === 'translate') {
      barCSS = { transform: `translate(${toBarPerc(n)}%, 0)` }
    } else {
      barCSS = { 'margin-left': `${toBarPerc(n)}%` }
    }

    barCSS['transition'] = `all ${speed}ms ${ease}`

    return barCSS
  }

  trickle() {
    return this.inc()
  }

  create(
    settings?: ProgressSetting
  ): ProgressImpl {
    return new ProgressImpl(settings)
  }
}

const Progress = new ProgressImpl(DEFAULT_SETTINGS)
export default Progress
