
/**
 * All the Test Case will run in one javascript running environment
 * so we need every test case has a new `container`
 */
export function createSingleContainer () {
  let container = document.getElementById('container')
  if (container) {
    document.body.removeChild(container)
  }
  container = document.createElement('div')
  container.id = 'container'
  document.body.appendChild(container)
  return container
}

/**
 * The HTML entity `&nbsp;` is not equal to the blank in javascript,
 * the former's unicode is `\160`, the latter's unicode is '\32'
 */
export function transformHTMLBlank (text) {
  return text.replace(/\s/g, String.fromCharCode(160))
}
