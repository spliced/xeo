# xeo.js

[pug](https://github.com/pugjs) + [less](https://github.com/less/less.js) -> pdf

![example](http://i.imgur.com/9QNF88L.png)

## Installation

`npm install xeo`

## Test

To see the example above, run: 
`npm install xeo && cd node_modules/xeo/test && node test && open final.pdf`

## Usage

```javascript
Xeo = require('xeo')
```

### new Xeo(config)

```javascript
const config = {
  lessPath: '/path/to/styles.less',
  pugPath: '/path/to/index.pug',
  target: '/path/to/final.pdf',
  fonts: [ 'google fonts', 'to import' ]
}

xeo = new Xeo(config)
// logs `Wrote file to /path/to/final.pdf`.
```

### xeo.css()

```javascript
let style = xeo.css()
console.log(style)
// logs compiled css
```

### xeo.html()

```javascript
let html = xeo.html()
console.log(html)
// logs compiled html
```

### xeo.drain()

Call the drain() method to remove temp files.

```javascript
xeo.drain()
// removes temp directory + contents
```
