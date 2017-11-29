import Controller from './core'
import Action from './action'
import WaitAction from './actions/wait'
import TypeAction from './actions/type'
import BackSpaceAction from './actions/backspace'
import MoveAction from './actions/move'
import { isType } from './utils'

/**
 * use `import` to import this class, you can open the path of magic
 * ```javascript
 * import Bilibala from 'bilibala'
 * var bilibala = new Bilibala(ele, 'hit the text', { speed: 120 })
 * // or
 * new Bilibala(ele, { speed: 120 })
 * .type('hit the text')
 * ```
 */
export default class Bilibala {
  /**
   * @param {Element} container
   * @param {String} [text]
   * @param {Object} [options]
   */
  constructor (container, text, options) {
    let ops = options
    if (text && isType(text)) {
      ops = text
    }
    this._instance = new Controller(container, ops)
    if (text && typeof text === 'string') {
      this._instance.addAction(new TypeAction({ text }))
    }
  }
  /**
   * backspace operation, you can use as below
   * ```javascript
   * bilibala.backspace(10, { speed: 150 })
   * ```
   * @param {Number} stepNum
   * @param {Object} [options]
   * @return {Bilibala} Bilibala instance
   */
  backspace (stepNum, options) {
    this._instance.addAction(new BackSpaceAction({ stepNum, ...options }))
    return this
  }
  /**
   * wait operation, you can use as below
   * ```javascript
   * bilibala.wait(1000)
   * ```
   * @param {Number} time - time to wait(ms)
   * @param {Object} [options]
   * @return {Bilibala} Bilibala instance
   */
  wait (time, options) {
    this._instance.addAction(new WaitAction({ time, ...options }))
    return this
  }

  /**
   * type operation, you can use as below
   * ```
   * bilibala.type('words', {
   *  style: {
   *    color: 'red'
   *  },
   *  tag: 'a',
   *  attrs: {
   *    href: ''
   *  }
   * })
   * ```
   * @param {String} text - typing text
   * @param {Object} [options]
   * @return {Bilibala} Bilibala instance
   */
  type (text, options) {
    this._instance.addAction(new TypeAction({ text, ...options }))
    return this
  }

  /**
   * move operation, you can use as below
   * ```
   * bilibala.move(-1)
   * bilibala.move(1)
   * ```
   * @param {Number} stepNum if stepNum > 0, move right else move left
   * @param {Object} [options]
   * @return {Bilibala} Bilibala instance
   */
  move (stepNum, options) {
    this._instance.addAction(new MoveAction({ stepNum, ...options }))
    return this
  }

  /**
   * Add a listener for current Bilibala instance
   * only support `start` and `end` event
   * `start` event will be fired when the `Action queue` start to execute a `Action`
   * `end` event will be fired when `Action queue` has been emptied
   * @param {String} eventType
   * @param {Function} callback
   * @return {Bilibala}
   */
  on (eventType, callback) {
    if (eventType === 'start' || eventType === 'end') {
      this._instance.register(eventType, callback)
    }
    return this
  }
}
