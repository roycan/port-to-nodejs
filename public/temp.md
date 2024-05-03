```js
const express = require('express');
const hbs = require('hbs');
const level = require('level');

const app = express();
const db = level('./my-db');

app.set('view engine', 'hbs');

app.get('/convert', (req, res) => {
  const entries = {};

  db.createReadStream()
    .on('data', function (data) {
      const key = data.key.toString();
      const value = data.value.toString();

      try {
        const objectData = JSON.parse(value);
        entries[key] = objectData;
      } catch (error) {
        entries[key] = value;
      }
    })
    .on('end', function () {
      res.render('database', { entries });
    })
    .on('error', function (err) {
      res.status(500).send("Failed to convert database: " + err);
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


```