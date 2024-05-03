```js
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    const value = obj[key];
    console.log(key, value);
  }
}
```