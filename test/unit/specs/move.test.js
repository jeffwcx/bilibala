import { Bilibala } from '../../../src/'
import { expect } from 'chai'
import { createSingleContainer, transformHTMLBlank } from './common'

describe('#move()', () => {
  beforeEach(() => {
    createSingleContainer()
  })

  it('move in the same element', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
    instance.type('move in the same element')
      .move(-10)
      .on('end', () => {
        expect(container.querySelector('.cursor').textContent).to.equal('a')
        done()
      })
  })

  it('move to the start point', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
    instance.type('12345678')
      .move(-8)
    instance.on('end', () => {
      const startEle = container.childNodes[0]
      // cursor will stay in first span
      expect(startEle.children[0].className).to.be.eq('cursor')
      done()
    })
  })

  it('move over several elements', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
    instance.type('move', { style: { color: 'red' } })
      .type('several ', { tag: 'a' })
      .type('elements')
      .move(-16)
    instance.type(' over ')
      .move(1000)
    instance.on('end', () => {
      expect(container.textContent).to.eq(transformHTMLBlank('move over several elements'))
      expect(container.querySelector('.cursor').textContent).to.equal('s')
      done()
    })
  })

  it('move over br', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
    instance.type('move\n')
      .type('over\n')
      .type('br')
      .move(-100)
      .move(100)
    instance.on('end', () => {
      expect(container.querySelector('.cursor').parentNode).to.be.eq(container.children[container.children.length - 1])
      done()
    })
  })

  it('move: wrong arguments', (done) => {
    const container = document.getElementById('container')
    expect(() => {
      new Bilibala(container)
        .move('12')
    }).to.throw(TypeError)
    done()
  })
})
