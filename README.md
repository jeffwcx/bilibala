<img src="./logo.png" alt="Bilibala logo" width="300" style="box-shadow: none;">

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)


> *A simple but powerful typewriting animation plugin written by ES6*


--------------------
👉Not only support **typing** and **backspace**, but also support **moving cursor** and **adding css style**
---------------------

## ShowCase 😲

## Usage 🔨

### step1. init a animate instance
1. using in es6
```javascript
import Bilibala from 'bilibala'
var instance = new Bilibala(element, [text], [options])
```
2. use in browser
```html
<div id="container"></div>
<script src="/path/bilibala.js"></script>
<script>
  window.onload = function () {
    const container = document.getElementById('container')
    new Bilibala(container, [text], [options])
  }
</script>
```

### step2. typing ,backspace...

1. typing
    ```javascript
    // it will type a character in 80ms
    instance.type('hello', {
      speed: 80
    })
    ```

1. backspace
    ```javascript
    instance.backspace(10, [options])
    ```
1. moving cursor
    ```javascript
    // move backward
    instance.move(-10)
    // move forward
    instance.move(10)
    ```
1. wait
    ```javascript
    // cursor will wait for 3000ms
    instance.wait(3000)
    ```
1. add css style when typing
    ```javascript
    instance.type('add style', {
      style: {
        color: 'red'
      }
    })
    ```
1. change the element type when typing
    ```javascript
    instance.type('github', {
      tag: 'a',
      attrs: {
        href: 'github.com'
      }
    })
    ```

## TODO 🔢

#### ❌ add compile support

## LICENSE

[MIT](./LICENSE)

