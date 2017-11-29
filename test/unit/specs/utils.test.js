import { addProperties, addAttrs, isType, insertAfter } from '../../../src/utils'

describe('utils methods', () => {
  it('#addProperties', (done) => {
    const styleEle = document.createElement('div')
    document.body.appendChild(styleEle)
    addProperties(styleEle.style, {
      'font-size': '12px'
    })
    expect(styleEle.style['font-size']).to.eq('12px')
    expect(() => {
      addProperties(styleEle, {
        color: 124
      })
    }).to.throw()

    expect(() => {
      addProperties(styleEle)
    }).to.not.throw()
    done()
  })

  it('#addAttrs', (done) => {
    const attrEle = document.createElement('div')
    document.body.appendChild(attrEle)
    addAttrs(attrEle, {
      'data-href': 'www.bilibala.com'
    })
    expect(attrEle.getAttribute('data-href')).to.eq('www.bilibala.com')

    expect(() => {
      addAttrs(attrEle, {
        'data-color': 124
      })
    }).to.throw()

    expect(() => {
      addAttrs(attrEle)
    }).to.not.throw()
    done()
  })

  it('#isType', (done) => {
    expect(isType('type', 'String')).to.be.true
    expect(isType('type', 'Object')).to.be.false
    expect(isType(1, 'Number')).to.be.true
    expect(isType(1, 'String')).to.be.false
    expect(isType(undefined, 'Undefined')).to.be.true
    expect(isType(null, 'Null')).to.be.true
    expect(isType(true, 'Boolean')).to.be.true
    expect(isType([1], 'Array')).to.be.true
    expect(isType({}, 'Object')).to.be.true
    done()
  })

  it('#insertAfter', (done) => {
    const oldChild = document.createElement('div')
    document.body.appendChild(oldChild)
    const new1 = document.createElement('div')
    insertAfter(new1, oldChild)
    expect(oldChild.nextSibling).to.eq(new1)
    expect(function () {
      insertAfter(null, oldChild)
    }).to.throw()

    expect(() => {
      insertAfter(new1, null)
    }).to.throw()
    done()
  })
})
