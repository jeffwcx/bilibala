/**
 * Action class, you can create your action like following code
 * ```javascript
 * class SomeAction extends Bilibala.Action {
 *  // some code here
 * }
 * ```
 */
export default class Action {
  constructor () {
    /**
     * the action's timer
     * @type {Timer}
     */
    this.timer = null // timer
    /**
     * action's current status
     * -1 -> not start; 0 -> running; 1 -> destroy
     * @type {Number}
     */
    this.status = -1
  }
  /**
   * execute main task of the Action
   * @param {Bilibala} controller Bilibala instance
   */
  exec (controller) {
    this.status = 0
  }

  /**
   * stop the action any time you want
   */
  stop () {
    if (this.timer) {
      this.timer.stop()
    }
  }

  /**
   * destroy the action
   */
  destroy () {
    this.stop()
    this.status = 1
    this.options = null
  }

  /**
   * exec the next action
   * every action must call this function when Action is done
   * @param {Bilibala} controller Bilibala instance
   */
  next (controller) {
    this.destroy()
    controller.exec()
  }
}
