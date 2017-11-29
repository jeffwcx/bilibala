import Action from '../action'
import Timer from '../timer'
import { isType } from '../utils'
import config from '../config'

/**
 * @ignore
 */
export default class BackSpaceAction extends Action {
  constructor (options) {
    if (!isType(options.stepNum, 'Number')) {
      throw TypeError('Argument "num" for BackSpaceAction must be a Number! ')
    }
    super()
    this.options = Object.assign({}, BackSpaceAction.CONFIG, options)
    this.count = 0
  }

  exec (controller) {
    super.exec(controller)
    this.timer = new Timer().loop(() => {
      if (this.count < this.options.stepNum) {
        if (!controller.backspace()) {
          this.next(controller)
        }
        this.count += 1
      } else {
        this.next(controller)
      }
    }, this.options.speed)
  }
}

BackSpaceAction.CONFIG = {
  stepNum: 0,
  speed: config.speed
}
