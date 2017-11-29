import { Bilibala } from '../../../src/'
import { expect } from 'chai'
import { createSingleContainer } from './common'

describe('#wait', () => {
  beforeEach(() => {
    createSingleContainer()
  })

  it('wait for 1000ms', (done) => {
    const container = document.getElementById('container')
    const now = Date.now()
    new Bilibala(container)
      .wait(1000)
      .on('end', () => {
        const end = Date.now()
        expect(end - now).to.be.within(1000, 1070)
        done()
      })
  })

  it('wait: wrong arguments', (done) => {
    const container = document.getElementById('container')
    expect(function () {
      new Bilibala(container)
        .wait('adfa')
    }).to.throw(TypeError)
    done()
  })
})
