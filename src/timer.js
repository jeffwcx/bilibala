
const defaultInterval = 1000 / 60

// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

// MIT license

if (!Date.now) {
  Date.now = function () { return new Date().getTime() }
}

;(function () {
  const vendors = ['webkit', 'moz']
  for (let i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i]
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame']
    window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] ||
                                window[vp + 'CancelRequestAnimationFrame'])
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
    !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0
    window.requestAnimationFrame = function (callback) {
      var now = Date.now()
      var nextTime = Math.max(lastTime + defaultInterval, now)
      return setTimeout(function () {
        callback(lastTime = nextTime)
      }, nextTime - now)
    }
    window.cancelAnimationFrame = clearTimeout
  }
}())

let raf = window.requestAnimationFrame
let caf = window.cancelAnimationFrame

/**
 * simple encapsulation for requestAnimationFrame
 */

let lastTime = 0
let dur = defaultInterval

/**
 * @ignore
 */
export default class Timer {
  constructor () {
    this.id = null
  }
  _getTime () {
    return Date.now()
  }
  _step (t, callback, isLoop) {
    return function () {
      let currTime = t._getTime()
      if (currTime - lastTime >= dur) {
        callback()
        lastTime = currTime
        if (!isLoop) t.stop()
      }
      if (t.id) {
        t.id = raf(t._step(t, callback, isLoop))
      }
    }
  }

  _run (callback, interval, isLoop) {
    dur = interval
    lastTime = this._getTime()
    this.id = raf(this._step(this, callback, isLoop))
    return this
  }

  /**
   * similar to setInterval
   * @param {Function} callback animate function
   * @param {Number} interval the interval to animate
   * @return Timer instance
   */
  loop (callback, interval) {
    return this._run(callback, interval, true)
  }

  /**
   * similar to setTimeout
   * @param {Function} callback animate function
   * @param {Number} interval the interval to call one time
   * @return Timer instance
   */
  one (callback, interval) {
    return this._run(callback, interval, false)
  }
  /**
   * stop the animate
   * @return {Timer} time instance
   */
  stop () {
    caf(this.id)
    this.id = null
    return this
  }
}
