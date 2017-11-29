import { Bilibala } from '../../../src'
import { expect } from 'chai'
import { createSingleContainer, transformHTMLBlank } from './common'

describe('#type()', () => {
  beforeEach(() => {
    createSingleContainer()
  })

  it('normal typing', (done) => {
    const container = document.getElementById('container')
    const text = 'just normal type'
    const instance = new Bilibala(container).type(text)
    instance.on('end', () => {
      expect(container.textContent).to.be.eq(transformHTMLBlank(text))
      done()
    })
  })

  it('typing between words', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
      .type('typing between words')
      .move(-5)
      .type('several ')
    instance.on('end', () => {
      expect(container.textContent).to.be.eq(transformHTMLBlank('typing between several words'))
      done()
    })
  })

  it('output a `\n`', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
      .type('ouput \n character')
    instance.on('end', () => {
      expect(container.children[2].tagName).to.be.eq('BR')
      expect(container.children[3].childNodes).to.have.lengthOf(0)
      done()
    })
  })

  it('add style for typing', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
      .type('add ', { style: { color: 'red' } })
      .type('style', { style: { 'font-style': 'italic' } })
    instance.on('end', () => {
      expect(container.children[1].style.color).to.be.eq('red')
      expect(container.children[2].style.fontStyle).to.be.eq('italic')
      done()
    })
  })

  it('output other tags', (done) => {
    const container = document.getElementById('container')
    const instance = new Bilibala(container)
      .type('output ', { tag: 'strong' })
      .type('another ', { tag: 'a', attrs: { href: 'https://github.com/jeffwcx' } })
      .type('tag')
    instance.on('end', () => {
      expect(container.children[1].tagName).to.equal('STRONG')
      expect(container.children[2].tagName).to.equal('A')
      expect(container.children[2].href).to.equal('https://github.com/jeffwcx')
      done()
    })
  })

  it('type: vary arguments', (done) => {
    const container = document.getElementById('container')
    new Bilibala(container, 'vary arguments')
      .type(123)
      .type(true)
      .on('end', () => {
        expect(container.textContent).to.eq(transformHTMLBlank('vary arguments123true'))
        done()
      })
  })
})
