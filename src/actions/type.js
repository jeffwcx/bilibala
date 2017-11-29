import Action from '../action'
import Timer from '../timer'
import config from '../config'
import { addProperties, addAttrs } from '../utils'

/**
 * @ignore
 */
export default class TypeAction extends Action {
  constructor (options) {
    super()
    this.options = Object.assign({}, config, options)
    this.options.text = this.options.text.toString()
    this.index = 0
  }

  exec (controller) {
    super.exec(controller)
    const op = this.options
    let ele = document.createElement(op.tag)
    if (op.style) {
      addProperties(ele.style, op.style)
    }
    if (op.attrs) {
      addAttrs(ele, op.attrs)
    }
    this.timer = new Timer().loop(() => {
      const curChar = op.text[this.index]
      if (curChar) {
        let br = null
        if (curChar === '\n') {
          br = document.createElement('br')
          if (this.index < op.text.length - 1) {
            ele = document.createElement(op.tag)
          }
        }
        controller.type(curChar, ele, br)
        this.index += 1
      } else {
        this.next(controller)
      }
    }, op.speed)
  }
}
