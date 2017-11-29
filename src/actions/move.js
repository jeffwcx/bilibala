import Action from '../action'
import Timer from '../timer'
import config from '../config'
import { isType } from '../utils'

/**
 * @ignore
 */
export default class MoveAction extends Action {
  constructor (options) {
    if (!isType(options.stepNum, 'Number')) {
      throw new TypeError('step argument for MoveAction is a Number!')
    }
    super()
    this.options = Object.assign({}, MoveAction.CONFIG, options)
    this.step = 0
    this.options.stepNum >= 0
      ? (this.direction = true)
      : (this.direction = false)
    this.stepNum = Math.abs(this.options.stepNum)
  }

  exec (controller) {
    super.exec(controller)
    this.timer = new Timer().loop(() => {
      if (this.step < this.stepNum) {
        if (!controller.move(this.direction)) {
          this.next(controller)
        }
        this.step += 1
      } else {
        this.next(controller)
      }
    }, this.options.speed)
  }
}

MoveAction.CONFIG = {
  speed: config.speed,
  stepNum: 0
}
