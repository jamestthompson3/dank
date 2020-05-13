---
title: Deep Javascript Notes
tags: [es6, javascript]
---
## Objects

An object can have a property that exists, but is `undefined`:

```javascript
const source = {
  set data(value) {
    this._data = value;
    }
  };

// Since there is only a setter, data exits
// but the _value_ is undefined
assert.equal('data' in source, true);
assert.equal(source.data, undefined);
```

Using `Object.assign()` to copy the `source` object will convert the _assessor_ property, `data` into a _data_ property. To copy this properly, we need to use `Object.defineProperties` in conjunction with `Object.getOwnPropertyDescriptors`:

```javascript
const desc = Object.getOwnPropertyDescriptors.bind(Object)
const target = {}
Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))

assert.deepEqual(
Object.getOwnPropertyDescriptors(target, 'data'),
{
  get: undefined,
  set: desc(source, 'data').set
  enumerable: true,
  configurable: true
});
```

## Classes

### Async class instantiation

You can use a factory function to asynchronously instantiate classes. To prevent calling `new` directly with this class, you can use a secret token:
```javascript
const secretToken = Symbol('secretToken');
class DataContainer {
  #data
  static async create() {
    const data = await Promise.resolve('downloaded');
    return new this(secretToken, data)
  }

  constructor(token, data) {
    if (token !== secretToken) {
      throw new Error('constructor is private!');
      this.#data = data;
    }

    getData() {
      return 'DATA: ' + this.#data;
      }
    }
}
```

!! A constructor always adds its private fileds to its `this`
