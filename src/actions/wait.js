import Action from '../action'
import { isType } from '../utils'
import Timer from '../timer'

/**
 * @ignore
 */
export default class WaitAction extends Action {
  constructor (options) {
    if (!isType(options.time, 'Number')) {
      throw new TypeError('time argument for StayAction must be a Number!')
    }
    super()
    this.options = Object.assign({}, WaitAction.CONFIG, options)
  }

  exec (controller) {
    super.exec(controller)
    this.timer = new Timer().one(() => {
      this.next(controller)
    }, this.options.time)
  }
}

WaitAction.CONFIG = {
  time: 0
}
