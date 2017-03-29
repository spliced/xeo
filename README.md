## quickstart<sup>[[4.21KB](https://raw.githubusercontent.com/spliced/xeo/master/xeo-min.js)]</sup>
xeo has no dependencies, just drop it into your html:
```javascript
<script src="/path/to/xeo-min.js"></script>
<script>
  let doublePlusOne = xeo.exec([2, 3, 4], '&+ *2')
  console.log(doublePlusOne)
  //  [5, 7, 9]
</script>
```

### [...or use server-side](https://www.npmjs.com/package/xeo)
***

## exec(_array, fns[, fold]_)
```javascript
let arr = ['here', 'are', 'some', 'strings', 'in an array']
let smallChunk = xeo.exec(arr, '/2 :<8')
console.log(smallChunk)
//  [['he','re'],['ar'],['so','me'],['st','ri','ng']]
```

```javascript
let thisYear = new Date().getFullYear()
let bornAfter = (data,target) => xeo.exec(data, `:>${(thisYear - target)}`)
let after1984 = bornAfter([22, 38, 46, 77, 11, 43, 72, 19, 24, 26, 26, 22], 1984)
console.log(after1984)
//  [38, 46, 77, 43, 72]
```

```javascript
let votes = [{color: 'red'},{color: 'blue'},{color: 'red'}]
let colorCount = (data,color) => xeo.exec(data, `@color`).filter(n => n[0]===color).length
let redCount = colorCount(votes, 'red')
console.log(redCount)
//  2
```
### [full documentation](http://codepen.io/spliced/full/BQMMBX/)
***
docs styled with `pug` and `less`
