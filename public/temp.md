```js
const invalidString = '{"name": "John", "age": 30, "city": "New York"';

try {
  const objectData = JSON.parse(invalidString);
  console.log(objectData);
} catch (error) {
  console.error('Error parsing JSON:', error.message);
  // Handle the error gracefully, such as displaying a user-friendly message or fallback behavior
}


```