import { afterEach, describe, expect, it, vi } from 'vitest'
import Progress from '../packages'
import { removeElement, deepClone } from '../packages/utils/basic'
import { equal } from 'assert'
import { mockDelay } from './utils'
import { isHTMLElement } from '../packages/utils/is'
import type { ProgressSetting } from '../packages/settings'

const getProgress = () => document.getElementById(Progress.progressId)
const rawSettings: ProgressSetting = deepClone(Progress.settings)
describe('n-progress-esm', () => {

  afterEach(() => {
    const nprogressEle = getProgress()
    if (nprogressEle) removeElement(nprogressEle)
    Progress.status = null
    Progress.settings = deepClone(rawSettings)
  })

  ////////////////////////// set() //////////////////////////

  describe('set', () => {
    it('progress should be rendered while set(0)', () => {
      Progress.set(0)
      const progressEl = getProgress()
      expect(progressEl).toBeTruthy()
      expect(progressEl?.querySelectorAll('.bar').length).toBe(1)
      expect(progressEl?.querySelectorAll('.peg').length).toBe(1)
      expect(progressEl?.querySelectorAll('.spinner').length).toBe(1)
    })

    it('progress should respect minimum', () => {
      Progress.set(0)
      equal(Progress.status, Progress.settings.minimum)
    })

    it('.set(100) should appear and disappear', async () => {
      Progress.configure({ speed: 10 })
      Progress.set(0)
      Progress.set(100)
      const progressEl = getProgress()
      expect(progressEl).toBeTruthy()
      await mockDelay(600)
      const parent = isHTMLElement(Progress.settings.parent)
        ? Progress.settings.parent
        : document.querySelector<HTMLElement>(Progress.settings.parent)!
      expect(Array.from(parent.classList).includes(('nprogress-custom-parent'))).toBeFalsy()
      expect(parent.querySelectorAll('#nprogress').length).toBe(0)
    })

    it('must clamp to minimum', () => {
      Progress.set(0)
      equal(Progress.status, Progress.settings.minimum)
    })

    it('must clamp to maximum', function () {
      Progress.set(100)
      equal(Progress.status, null)
    })

    it('setting.showSpinner is false, spinner should be removed', async () => {
      Progress.settings.showSpinner = false
      Progress.set(0)
      await mockDelay(800)
      const spinner = document.querySelector<HTMLElement>(
        Progress.settings.spinnerSelector
      )
      expect(spinner).toBeNull()
    })

    it('setting.body is not body, it should be add expected class', async () => {
      const parent = document.createElement('div')
      parent.setAttribute('id', 'parent')
      Progress.settings.parent = '#parent'
      document.body.append(parent)
      Progress.set(0)
      expect(parent.classList.contains('yev-progress-custom-parent')).toBeTruthy()
    })

    it('set should bind the correct positionUsing style', () => {
      Progress.set(0)
      expect(['translate3d', 'translate', 'margin'].includes(Progress.settings.positionUsing)).toBeTruthy()
    })
  })

  ////////////////////////// start() //////////////////////////

  describe('start', () => {
    it('progress should be rendered while start', () => {
      Progress.start()
      const progressEl = getProgress()
      expect(progressEl).toBeTruthy()
      expect(progressEl?.querySelectorAll('.bar').length).toBe(1)
      expect(progressEl?.querySelectorAll('.peg').length).toBe(1)
      expect(progressEl?.querySelectorAll('.spinner').length).toBe(1)
    })

    it('progress should respect minimum', () => {
      Progress.start()
      equal(Progress.status, Progress.settings.minimum)
    })

    it('static method trickle should be called', async () => {
      Progress.trickle = vi.fn()
      Progress.start()
      await mockDelay(600)
      expect(Progress.trickle).toHaveBeenCalled()
    })
  })

  describe('done', () => {
    it('should be removed from the parent', () => {
      Progress.done()
      setTimeout(() => {
        const progressEl = getProgress()
        expect(progressEl).toBeFalsy()
      }, 200)
    })
  })

  describe('inc', () => {
    it('should render', function () {
      Progress.inc();
      const progressEl = getProgress()
      expect(progressEl).toBeTruthy()
    });

    it('should start with minimum', function () {
      Progress.inc()
      equal(Progress.status, Progress.settings.minimum)
    });

    it('should increment', function () {
      Progress.start()
      var start = Progress.status
      Progress.inc();
      expect(Progress.status! > start!).toBeTruthy()
    })

    it('should never reach 100', function () {
      for (let i = 0; i < 100; ++i) { Progress.inc() }
      expect(Progress.status! < 100).toBeTruthy()
    })

    it('should not increment if status is greater than 100', () => {
      const startSpy = vi.fn(Progress.start)
      const setSpy = vi.fn(Progress.set)

      Progress.status = 110
      Progress.inc()

      expect(startSpy).not.toHaveBeenCalled()
      expect(setSpy).not.toHaveBeenCalled()
    });

    it('should set amount to 0 if status is not in specified ranges', () => {
      Progress.start = vi.fn()
      Progress.set = vi.fn()

      Progress.status = -5
      Progress.inc('not a number')

      expect(Progress.start).not.toHaveBeenCalled()
      expect(Progress.set).toHaveBeenCalledWith
    })
  })

  describe('remove', () => {
    it('should be removed from the parent', () => {
      Progress.start()
      setTimeout(() => {
        Progress.remove()
        const progressEl = getProgress()
        expect(progressEl).toBeFalsy()
      }, 200)
    })
  })

  describe('create', () => {
    it('create can create a new prgress impl', () => {
      const childProgress = Progress.create()
      childProgress.start()

      const childProgressEl = document.getElementById(childProgress.elementId)
      const mainProgress = getProgress()
      expect(childProgressEl).toBeTruthy()
      expect(mainProgress).toBeFalsy()
    })
  })
})
