
/**
 * add properties for css style object
 * @param {CSSStyleDeclaration} style
 * @param {Object} styleObj
 * @ignore
 */
export function addProperties (style, styleObj = {}) {
  const cssProps = Object.keys(styleObj)
  cssProps.forEach(prop => {
    if (!isType(styleObj[prop], 'String')) {
      throw new TypeError('css property must be string')
    }
    style.setProperty(prop, styleObj[prop])
  })
}

/**
 * add attribute for element
 * @param {Element} ele
 * @param {Object} attrs
 * @ignore
 */
export function addAttrs (ele, attrs = {}) {
  const attrsKeys = Object.keys(attrs)
  attrsKeys.forEach(key => {
    if (!isType(attrs[key], 'String')) {
      throw new TypeError('Attribute value must be string')
    }
    ele.setAttribute(key, attrs[key])
  })
}

/**
 * insert new child after refChild
 * @param {Node} newChild
 * @param {Node} refChild
 * @return new child
 * @ignore
 */
export function insertAfter (newChild, refChild) {
  if (!refChild || !refChild) {
    throw new Error('Null point errors')
  }
  let nextNode = refChild.nextSibling
  let parentNode = refChild.parentNode
  if (nextNode) {
    parentNode.insertBefore(newChild, nextNode)
  } else {
    parentNode.appendChild(newChild)
  }
  return newChild
}

/**
 * judge variable's type
 * @param {*} target
 * @param {String} type must capitalize the first letter
 * @return {Boolean}
 * @ignore
 */
export function isType (target, type) {
  const typeStr = Object.prototype.toString.call(target)
  return typeStr.search(type) >= 0
}
