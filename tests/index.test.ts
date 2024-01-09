import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import NProgress from '../packages'
import { extend, removeElement } from '../packages/utils/basic'
import type { NProgressSetting } from '../packages/settings'
import { equal } from 'assert'

const getProgress = () => document.getElementById('nprogress')

describe('n-progress-esm', () => {
  let settings: NProgressSetting

  beforeEach(() => {
    settings = extend({}, NProgress.settings)
  })

  afterEach(() => {
    const nprogressEle = getProgress()
    if (nprogressEle) removeElement(nprogressEle)
    NProgress.status = null
    extend(settings, NProgress.settings)
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

    it('.set(100) should appear and disappear', () => {
      NProgress.configure({ speed: 10 })
      NProgress.set(0)
      NProgress.set(100)
      const progressEl = getProgress()
      expect(progressEl).toBeTruthy()

      setTimeout(() => {
        expect(progressEl).toBeFalsy()
      }, 70)
    })

    it('must clamp to minimum', () => {
      NProgress.set(0)
      equal(NProgress.status, NProgress.settings.minimum)
    })

    it('must clamp to maximum', function () {
      NProgress.set(100)
      equal(NProgress.status, null)
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
  })

  describe('done', () => {
    it('should be removed from the parent', () => {
      NProgress.done()
      setTimeout(() => {
        const progressEl = getProgress()
        expect(progressEl).toBeFalsy()
      }, 70)
    })
  })

  describe('remove', () => {
    it('should be removed from the parent', () => {
      NProgress.remove()
      const progressEl = getProgress()
      expect(progressEl).toBeFalsy()
    })
  })
})
