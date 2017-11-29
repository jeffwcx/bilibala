import config from './config'
import { addProperties, insertAfter, isType } from './utils'

/**
 * fundamental operations for Bilibala
 * @ignore
 */
export default class Controller {
  /**
   * @param {Element} container
   * @param {Object} [options]
   */
  constructor (container, options) {
    this.options = Object.assign(config, options)
    this.container = container
    this._createLine()
    this._createCursor()

    this._events = {}
    this.lastAction = null
    /**
     * @type {Action}
     * @see Action
     */
    this.currentAction = null
    this.startEle = null

    /**
     * @type {Array}
     */
    this.actionQueue = []
  }
  /**
   *
   * @param {String} ch - the character to type
   * @param {Element} [ele] - the character will type into the element
   * @param {HTMLBRElement} [br] - if the char is \n
   */
  type (ch, ele, br) {
    let parentNode = this.cursor.parentNode
    let previousNode = this.cursor.previousSibling
    const cursorText = this.cursor.textContent

    if (br) { // if has br
      const fragment = document.createDocumentFragment()
      fragment.appendChild(br)
      this._createLine()
      fragment.appendChild(this.startEle)
      this.startEle.appendChild(this.cursor)
      insertAfter(fragment, parentNode)
    }

    parentNode = this.cursor.parentNode
    // when need to create a span
    if (ele && ele.parentNode === null) {
      const cursorRight = this.cursor.nextSibling
      if (cursorRight && cursorRight.textContent) { // need split
        const cloneParent = parentNode.cloneNode(false)
        cloneParent.appendChild(cursorRight)
        insertAfter(cloneParent, parentNode)
      }
      insertAfter(ele, parentNode)
      ele.appendChild(document.createTextNode(''))
      ele.appendChild(this.cursor)
    }

    parentNode = this.cursor.parentNode
    if (cursorText) {
      previousNode.textContent += cursorText
    }
    if (br) {
      this.cursor.textContent = ''
      return
    }
    if (ch === ' ') {
      this.cursor.innerHTML = '&nbsp;'
      return
    }
    this.cursor.textContent = ch
  }

  /**
   * move cursor(one char)
   * @param {Boolean} direction
   * @return {Boolean} could move or not
   */
  move (direction) {
    const cursorText = this.cursor.textContent
    let prevNode = this.cursor.previousSibling
    let nextNode = this.cursor.nextSibling
    // when move to right direction
    if (direction) {
      let firstChar
      // when cursor reach the right limitation of the region
      if (!nextNode || (nextNode && !nextNode.textContent)) {
        if (nextNode) { // remove unusable textNode
          this.cursor.parentNode.removeChild(nextNode)
        }
        let nextParent = this.cursor.parentNode.nextSibling
        if (nextParent) {
          if (nextParent.tagName.toLocaleLowerCase() === 'br') {
            nextParent = nextParent.nextSibling
          }
          const nextParentChild = nextParent.childNodes[0]
          if (!nextParentChild) {
            nextParent.appendChild(this.cursor)
          } else {
            nextParent.insertBefore(this.cursor, nextParentChild)
          }
          nextNode = this.cursor.nextSibling
        } else {
          nextNode = null
          return false
        }
      }
      if (!nextNode) {
        firstChar = ''
      } else {
        firstChar = nextNode.textContent.substr(0, 1)
        nextNode.textContent = nextNode.textContent.substring(1)
      }
      if (!prevNode) {
        prevNode = document.createTextNode('')
        this.cursor.parentNode.insertBefore(prevNode, this.cursor)
      }
      prevNode.textContent = prevNode.textContent + cursorText
      this.cursor.textContent = firstChar
    } else {
      let lastChar
      // when this cursor reach the left limitation of the region
      if (!prevNode || (prevNode && !prevNode.textContent)) {
        if (prevNode) {
          this.cursor.parentNode.removeChild(prevNode)
        }
        let prevParent = this.cursor.parentNode.previousSibling
        if (prevParent) {
          if (prevParent.tagName.toLocaleLowerCase() === 'br') {
            prevParent = prevParent.previousSibling
          }
          prevParent.appendChild(this.cursor)
          prevNode = this.cursor.previousSibling
        } else {
          return false
        }
      }
      if (!prevNode) {
        lastChar = ''
      } else {
        lastChar = prevNode.textContent.substr(-1)
        prevNode.textContent = prevNode.textContent.slice(0, -1)
      }
      if (!nextNode) {
        nextNode = document.createTextNode('')
        insertAfter(nextNode, this.cursor)
      }
      nextNode.textContent = cursorText + nextNode.textContent
      this.cursor.textContent = lastChar
    }
    return true
  }
  /**
   * backspace: delete a char
   * @return {String} current delete text
   */
  backspace () {
    let prevNode = this.cursor.previousSibling
    if (!prevNode || (prevNode && !prevNode.textContent)) {
      let parentNode = this.cursor.parentNode
      if (prevNode) {
        parentNode.removeChild(prevNode)
      }
      let prevParent = parentNode.previousSibling
      if (!prevParent) return false
      if (prevParent.nodeName.toLocaleLowerCase() === 'br') {
        const delEle = prevParent
        prevParent = prevParent.previousSibling
        this.container.removeChild(delEle)
      }
      prevParent.appendChild(this.cursor)
      if (!parentNode.textContent) { // remove unusable input region
        this.container.removeChild(parentNode)
      }
      prevNode = this.cursor.previousSibling
      if (!prevNode) {
        this.cursor.textContent = ''
        return true
      }
    }
    let lastChar = prevNode.textContent.substr(-1)
    this.cursor.textContent = lastChar
    prevNode.textContent = prevNode.textContent.slice(0, -1)
    return this.cursor.textContent
  }

  /**
   * stop: wait for some time
   * @method stop
   * @return {Bilibala} bilibala instance
   */
  stop () {
    if (this.currentAction) {
      this.currentAction.stop()
    }
    return this
  }

  /**
   * exec: run all actions
   * @method exec
   */
  exec () {
    if (this.currentAction && this.currentAction.status === 0) return
    if (this.actionQueue.length > 0) {
      this.lastAction = this.currentAction
      this.currentAction = this.actionQueue.shift()
      this.currentAction.exec(this)
    } else {
      this.stop()
      this.currentAction = null
      this.fire('end')
    }
  }

  /**
   * create a Action
   * @param {Action} action
   */
  addAction (action) {
    this.actionQueue.push(action)
    if (!this.currentAction) {
      this.exec()
      this.fire('start')
    }
  }

  /**
   * register a event
   * @param {String} eventType - event type
   * @param {Function} callback - function execute when event fired
   */
  register (eventType, callback) {
    const evts = this._events
    if (isType(evts[eventType], 'Undefined')) {
      evts[eventType] = []
    }
    if (isType(callback, 'Function')) {
      evts[eventType].push(callback)
    }
  }

  /**
   * fire all the functions own to eventType
   * @param {String} eventType
   */
  fire (eventType) {
    const fnQueue = this._events[eventType]
    if (isType(fnQueue, 'Array')) {
      while (fnQueue.length > 0) {
        fnQueue.splice(0, 1)[0]()
      }
    }
  }
  // create a line
  _createLine () {
    this.startEle = document.createElement('span')
    this.startEle._bilibalaStart = true
  }
  // create cursor
  _createCursor () {
    this.cursor = document.createElement('span')
    this.cursor.className = this.options.cursorClass
    addProperties(this.cursor.style, this.options.cursorStyle)
    this.startEle.appendChild(this.cursor)
    this.container.appendChild(this.startEle)
  }
}
