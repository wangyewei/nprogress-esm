import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import NProgress from '../packages'
import { removeElement, deepClone } from '../packages/utils/basic'
import { equal } from 'assert'
import { mockDelay } from './utils'
import { isHTMLElement } from '../packages/utils/is'
import type { NProgressSetting } from '../packages/settings'


const getProgress = () => document.getElementById('nprogress')
const rawSettings: NProgressSetting = deepClone(NProgress.settings)

describe('n-progress-esm', () => {


  afterEach(() => {
    const nprogressEle = getProgress()
    if (nprogressEle) removeElement(nprogressEle)
    NProgress.status = null
    NProgress.settings = deepClone(rawSettings)
  })

  ////////////////////////// set() //////////////////////////

  describe('set', () => {
    it('progress should be rendered while set(0)', () => {
      NProgress.set(0)
      const progressEl = getProgress()
      expect(progressEl).toBeTruthy()
      expect(progressEl?.querySelectorAll('.bar').length).toBe(1)
      expect(progressEl?.querySelectorAll('.peg').length).toBe(1)
      expect(progressEl?.querySelectorAll('.spinner').length).toBe(1)
    })

    it('progress should respect minimum', () => {
      NProgress.set(0)
      equal(NProgress.status, NProgress.settings.minimum)
    })

    it('.set(100) should appear and disappear', async () => {
      NProgress.configure({ speed: 10 })
      NProgress.set(0)
      NProgress.set(100)
      const progressEl = getProgress()
      expect(progressEl).toBeTruthy()
      await mockDelay(600)
      const parent = isHTMLElement(NProgress.settings.parent)
        ? NProgress.settings.parent
        : document.querySelector<HTMLElement>(NProgress.settings.parent)!
      expect(Array.from(parent.classList).includes(('nprogress-custom-parent'))).toBeFalsy()
      expect(parent.querySelectorAll('#nprogress').length).toBe(0)
    })

    it('must clamp to minimum', () => {
      NProgress.set(0)
      equal(NProgress.status, NProgress.settings.minimum)
    })

    it('must clamp to maximum', function () {
      NProgress.set(100)
      equal(NProgress.status, null)
    })

    it('setting.showSpinner is false, spinner should be removed', async () => {
      NProgress.settings.showSpinner = false
      NProgress.set(0)
      await mockDelay(800)
      const spinner = document.querySelector<HTMLElement>(
        NProgress.settings.spinnerSelector
      )
      expect(spinner).toBeNull()
    })

    it('setting.body is not body, it should be add expected class', async () => {
      const parent = document.createElement('div')
      parent.setAttribute('id', 'parent')
      NProgress.settings.parent = '#parent'
      document.body.append(parent)
      NProgress.set(0)
      expect(parent.classList.contains('nprogress-custom-parent')).toBeTruthy()
    })

    it('set should bind the correct positionUsing style', () => {
      NProgress.set(0)
      expect(['translate3d', 'translate', 'margin'].includes(NProgress.settings.positionUsing)).toBeTruthy()
    })
  })

  ////////////////////////// start() //////////////////////////

  describe('start', () => {
    it('progress should be rendered while start', () => {
      NProgress.start()
      const progressEl = getProgress()
      expect(progressEl).toBeTruthy()
      expect(progressEl?.querySelectorAll('.bar').length).toBe(1)
      expect(progressEl?.querySelectorAll('.peg').length).toBe(1)
      expect(progressEl?.querySelectorAll('.spinner').length).toBe(1)
    })

    it('progress should respect minimum', () => {
      NProgress.start()
      equal(NProgress.status, NProgress.settings.minimum)
    })

    it('static method trickle should be called', async () => {
      NProgress.trickle = vi.fn()
      NProgress.start()
      await mockDelay(600)
      expect(NProgress.trickle).toHaveBeenCalled()
    })
  })

  describe('done', () => {
    it('should be removed from the parent', () => {
      NProgress.done()
      setTimeout(() => {
        const progressEl = getProgress()
        expect(progressEl).toBeFalsy()
      }, 200)
    })
  })

  describe('inc', () => {
    it('should render', function () {
      NProgress.inc();
      const progressEl = getProgress()
      expect(progressEl).toBeTruthy()
    });

    it('should start with minimum', function () {
      NProgress.inc()
      equal(NProgress.status, NProgress.settings.minimum)
    });

    it('should increment', function () {
      NProgress.start()
      var start = NProgress.status
      NProgress.inc();
      expect(NProgress.status! > start!).toBeTruthy()
    })

    it('should never reach 100', function () {
      for (let i = 0; i < 100; ++i) { NProgress.inc() }
      expect(NProgress.status! < 100).toBeTruthy()
    })

    it('should not increment if status is greater than 100', () => {
      const startSpy = vi.fn(NProgress.start)
      const setSpy = vi.fn(NProgress.set)

      NProgress.status = 110
      NProgress.inc()

      expect(startSpy).not.toHaveBeenCalled()
      expect(setSpy).not.toHaveBeenCalled()
    });

    it('should set amount to 0 if status is not in specified ranges', () => {
      NProgress.start = vi.fn()
      NProgress.set = vi.fn()

      NProgress.status = -5
      NProgress.inc('not a number')

      expect(NProgress.start).not.toHaveBeenCalled()
      expect(NProgress.set).toHaveBeenCalledWith
    })
  })

  describe('remove', () => {
    it('should be removed from the parent', () => {
      NProgress.start()
      setTimeout(() => {
        NProgress.remove()
        const progressEl = getProgress()
        expect(progressEl).toBeFalsy()
      }, 200)
    })
  })
})
