import { Bilibala } from '../../../src/'
import { expect } from 'chai'
import { createSingleContainer, transformHTMLBlank } from './common'

describe('#backspace', () => {
  beforeEach(() => {
    createSingleContainer()
  })
  it('normal backspace', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
    instance.type('normal backspace')
      .backspace(10)
      .on('end', () => {
        expect(container.textContent).to.equal('normal')
        done()
      })
  })

  it('backspace several elements', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
    instance.type('backspace ')
      .type('several eles')
      .backspace(4)
      .type('elements')
      .backspace(22)
      .on('end', () => {
        expect(container.textContent).to.equal('back')
        done()
      })
  })

  it('backspace between words', (done) => {
    const container = document.getElementById('container')
    new Bilibala(container)
      .type('backspace ')
      .type('between ')
      .type('words')
      .move(-5)
      .backspace(8)
      .on('end', () => {
        expect(container.textContent).to.eq(transformHTMLBlank('backspace words'))
        done()
      })
  })

  it('backspace line break', (done) => {
    const container = document.getElementById('container')
    new Bilibala(container)
      .type('backspace \n')
      .type('line \n')
      .type('break')
      .backspace(100)
      .on('end', () => {
        expect(container.querySelector('.cursor')).to.eq(container.children[0].children[0])
        done()
      })
  })

  it('backspace: wrong argument', (done) => {
    const container = document.getElementById('container')
    expect(() => {
      new Bilibala(container)
        .type('123')
        .backspace()
        .backspace('sdfds')
    }).to.throw(TypeError)
    done()
  })
})
