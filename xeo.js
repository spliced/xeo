xeo = {};
xeo.id = n => n
xeo.exec = function(arr, str, fold){
  if(!arr || !(arr instanceof Array)) return 'Error: Array required as first parameter.'
  let numbers = arr.every(n => +n), // TRUE if every element of arr is numeric, FALSE otherwise
      base = str.split(' ').reverse(),
      fns = base.map(n=>{let s=''; return n.replace(':', '').split('').map(n => (this[s+=n] ? s : null)).filter(n=>n)}),
      // returns an array of fuctions supplied in str
      args = base.map((f, idx) => f.replace(':', '').replace(fns[idx], '').split(',').filter(n=>n))
      // returns an array of arrays containing the function arguments supplied in str
  
  /** 
   * mutates the value of arr to facilitate function chaining
   * type is determined by whether the given function was preceded by a ':'
   * a ':' indicates that a function is to be used as a filter
   * otherwise, all functions are executed as maps
   *
   * the value of 'this' is the global object xeo
   **/
  fns.forEach((f, idx) => {
    const type = !base[idx].match(':') ? 'map' : 'filter',
          myFn = this[f],
          params = args[idx].map(n => +n || n)
    arr = arr[type](n => myFn(n, ...params))
  })
  
  /**
   * if(!fold) return the modified array
   * if(fold)
   *    # -- return the sum of its elements
   *    T/F -- return the count of 'true' values
   *    abc -- return a single concatenated string
   *    [] -- return a single flattened array of values
   *    Map() -- return the union of all Maps
   *    Set() -- return the union of all Sets
   *    {} -- return a single merged object
   **/

  return (!fold ? arr
    : arr.every(n=>+n) || arr.every(n=>typeof n === 'boolean') ? arr.reduce((n , i) => n + i)
    : arr.every(n=>typeof n==='string') ? arr.join(' ')
    : arr.every(n=>Array.isArray(n)) ? (r=[], arr.map(n=>r.push(...n)), r)
    : arr.every(n=>n instanceof Map || n instanceof WeakMap) ? (m=[], arr.map(n=>m.push(...n.entries())), new Map(m))
    : arr.every(n=>n instanceof Set || n instanceof WeakSet) ? (o=[], arr.map(n=>o.push(...n.values())), new Set(o))
    : Object.assign(...arr))

}
xeo.def = function(name, results){
  let chars = name.split(''), str = '';
  let match = chars.map((n, i)=>this[chars.slice(0,i+1)])
  match = match.filter(n=>n!==undefined).length > 0
  if(match) { console.log('Invalid Name, function not added.'); return }
  this[name] = function(n, ...args) {
    let type = typeof n !== 'object' ? typeof n :
    n instanceof Array ? 'array' :
    n instanceof Map || n instanceof WeakMap ? 'map' :
    n instanceof Set || n instanceof WeakSet ? 'set' :
    n instanceof Object ? 'object' : null
    return results[type](n, args)
  }
}
xeo.def('+', {
  number: (n, args) => args.reduce((n,i)=>n+i) + n,
  string: (n, args) => `${n} ${args.join(' ')}`,
  array: (n, args) => [...n, ...args],
  map: (n, args) => {args.map(n=>n.split('=')).forEach(a => n.set(a[0], +a[1] || a[1])); return n},
  set: (n, args) => {args.forEach(a => n.add(a)); return n},
  object: (n, args) => {args.map(n=>n.split('=')).forEach(a => n[a[0]] = +a[1] || a[1]); return n}
})
xeo.def('-', {
  number: (n, args) => n - args.reduce((n,i)=>n-i),
  string: (n, args) => {args.forEach(a => n = new RegExp(a, 'g')[Symbol.replace](n, '')); return n},
  array: (n, args) => n.filter(n => !args.some(a => a === n)),
  map: (n, args) => {args.forEach(a => n.delete(a)); return n},
  set: (n, args) => {args.forEach(a => n.delete(a)); return n},
  object: (n, args) => {args.forEach(a => delete n[a]); return n}
})
xeo.def('*', {
  number: (n, args) => args.reduce((n,i)=>n*i) * n,
  string: (n, i) => Array(+i).fill(n).join(' '),
  array: (n, i) => {r=[]; while(i-->0){r.push(...n)}; return r},
  map: (n, args) => this.c(n),
  set: (n, args) => this.c(n),
  object: (n, args) => this.c(n)
})
xeo.def('/', {
  number: (n, i) => n / i,
  string: (n, i) => {let a = []; let o = () => n.length >= i ? (a.push(n.slice(0, i)), n=n.slice(i), o()) : a; return o()},
  array: (n, i) => {let a = []; let o = () => n.length >= i ? (a.push(n.slice(0, i)), n=n.slice(i), o()) : a; return o()},
  map: (n, args) => xeo.id(n),
  set: (n, args) => xeo.id(n),
  object: (n, args) => xeo.id(n),
})
xeo.def('%', {
  number: (n, i) => n % i,
  string: (n, i) => n.slice(n.length-(n.length%i)),
  array: (n, i) => n.slice(n.length-(n.length%i)),
  map: (n, args) => xeo.id(n),
  set: (n, args) => xeo.id(n),
  object: (n, args) => xeo.id(n)
})
xeo.def('&+', {
  number: n => n+1,
  string: (n, args) => xeo.id(n),
  array: (n, i) => [...n, ''],
  map: (n, args) => xeo.id(n),
  set: (n, args) => xeo.id(n),
  object: (n, args) => xeo.id(n),
})
xeo.def('&-', {
  number: (n, args) => n-1,
  string: (n, args) => n.slice(0, -1),
  array: (n, args) => n.slice(0, -1),
  map: (n, args) => xeo.id(n),
  set: (n, args) => xeo.id(n),
  object: (n, args) => xeo.id(n),
})
xeo.def('==', {
  number: (n, i) => n == i,
  string: (n, i) => n == i,
  array: (n, i) => n.length == i,
  map: (n, i) => [...n.keys()].length == i,
  set: (n, i) => [...n.values()].length == i,
  object: (n, args) => xeo.id(n),
})
xeo.def('!=', {
  number: (n, i) => n != i,
  string: (n, i) => n != i,
  array: (n, i) => n.length != i,
  map: (n, i) => [...n.keys()].length != i,
  set: (n, i) => [...n.values()].length != i,
  object: (n, args) => xeo.id(n),
})
xeo.def('>', {
  number: (n, i) => n > i,
  string: (n, i) => n.length > i,
  array: (n, i) => n.length > i,
  map: (n, i) => [...n.keys()].length > i,
  set: (n, i) => [...n.values()].length > i,
  object: (n, args) => xeo.id(n),
})
xeo.def('<', {
  number: (n, i) => n < i,
  string: (n, i) => n.length < i,
  array: (n, i) => n.length < i,
  map: (n, i) => [...n.keys()].length < i,
  set: (n, i) => [...n.values()].length < i,
  object: (n, args) => xeo.id(n),
})
xeo.def('=>', {
  number: (n, i) => n >= i,
  string: (n, i) => n.length >= i,
  array: (n, i) => n.length >= i,
  map: (n, i) => [...n.keys()].length >= i,
  set: (n, i) => [...n.values()].length >= i,
  object: (n, args) => xeo.id(n),
})
xeo.def('=<', {
  number: (n, i) => n <= i,
  string: (n, i) => n.length <= i,
  array: (n, i) => n.length <= i,
  map: (n, i) => [...n.keys()].length <= i,
  set: (n, i) => [...n.values()].length <= i,
  object: (n, args) => xeo.id(n),
})
xeo.def('~', {
  number: (n, args) => xeo.id(n),
  string: (n, args) => n.length,
  array: (n, args) => n.length,
  map: (n, args) => [...n.keys()].length,
  set: (n, args) => [...n.values()].length,
  object: (n, args) => xeo.id(n),
})
xeo.def('@', {
  number: (n, args) => xeo.id(n),
  string: (n, args) => args.map(i => n[i]),
  array: (n, args) => args.map(i => n[i]),
  map: (n, args) => args.map(i => n.get(i)),
  set:  (n, args) => xeo.id(n),
  object: (n, args) => args.map(i => n[i]),
})

/* xeo.def('', {
  number: (n, args) => xeo.id(n),
  string: (n, args) => xeo.id(n),
  array: (n, args) => xeo.id(n),
  map: (n, args) => xeo.id(n),
  set: (n, args) => xeo.id(n),
  object: (n, args) => xeo.id(n),
}) */
