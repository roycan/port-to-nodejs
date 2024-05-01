// Loads the express module
const express = require('express');

const bodyParser = require('body-parser');
const path  = require('path');

// Loads the database
const dbStorage = require('./dbStorage');



//Creates our express server
const app = express();
const port = 3000;


//Serves static files (we need it to import a css file)
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));





////////////Set basic routes

app.get('/', (req,res) => {

  res.redirect('index.html');

})

app.post('/saveNote', (req,res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const timestamp = new Date().toLocaleString();
  const key = name + timestamp;

  let entry = {};
  entry.name = name;
  entry.email = email;
  entry.message = message;
  entry.timestamp = timestamp;

  const value = JSON.stringify(entry);

  console.log(`saving: ${key} , ${value}`);
  dbStorage.setItem(key, value)
    .catch(function(err){
      res.status(500).send("Error writing to DB!" + err);
    })
  
  res.redirect('thankyou.html');
})


app.get('/messages', function (req,res){

  dbStorage.getAll()
    .then(function(entries){
      // Object.entries(entries).forEach(([key, value]) => {
      //   console.log(key, JSON.parse(value.toString()));
      // });
      console.log(entries.toString());
      res.render('messages', {log:entries})
    })
    .catch(function(err){
      res.status(500).send("failed to read DB records: " + err)
    })


})




//////// DB STORAGE ADMIN ROUTES
app.get('/db_storage', (req,res) => {
  res.render('db_storage');
})

app.post('/save', (req, res) => {
  let key = req.body.key;
  let value = req.body.value;
  if (!key || !value){
    res.status(400).send('Both key and value are needed.');
    return;
  }

  dbStorage.setItem(key, value)
    .then(function () {
      console.log(`saved: ${key} - ${value}`);
      res.render('db_storage', {keys: key, value: value});
    })
    .catch(function(err){
      res.status(500).send('Error adding entry to the database' + err);
    })
})

app.post('/read', function (req,res) {
  let key = req.body.read;
  dbStorage.getItem(key)
    .then(function (value){
      res.render('db_storage', {value:value});
    })
    .catch(function (err){
      if (err.notFound){
        res.status(404).send('Entry not found.')
      }
      else{
        res.status(404).send('Error retrieving entry from the database.' + err)
      }
    })
}) 

app.post('/readIndex', function (req,res) {
  
  dbStorage.key(Number(req.body.index))
    .then(function (data){
      const key = data.key;
      const value = data.value;
      res.render('db_storage', {keys: key, value:value});
    })
    .catch(function (err){
      res.send('Failed to retrieve data: ', err);
    })
})


app.post('/showKeys', (req,res) =>{
  dbStorage.getKeys()
    .then( function(keys){
      res.render('db_storage', {keys: keys})
    })
    .catch( function (err) {
      console.log("Error retrieving Keys: ", err);
    })
})

app.post('/showCount', (req, res) =>{
  dbStorage.length()
    .then(function (count){
      res.render('db_storage', {count:count});
    })
    .catch(function (err){
      res.status(500).send("Error retrieving number of entries from the database: " + err)
    })
})


app.post('/showLog', (req,res) =>{
  dbStorage.getAll()
    .then(function(entries){
      res.render('db_storage', {log:entries})
    })
    .catch(function(err){
      res.status(500).send("failed to read DB records: " + err)
    })
})

app.post('/delete', (req, res) => {
  dbStorage.delItem(req.body.delete)
    .then(function (){
      res.render('db_storage');
    })
    .catch(function (err){
      res.status(500).send('Error deleting item from DB.' + err);

    })
  
})


app.post('/deleteAll', (req,res) =>{
  dbStorage.clear()
    .then(function (){
      res.render('db_storage')
    })
    .catch(function(err){
      res.status(500).send('Error deleting records from the DB.' + err)
    })
  
})



/////// TEST ROUTES
app.get('/samplePutGet', (req,res) => {
  dbStorage.samplePutGet();
})




//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`))



// Close the database connection before program exit
process.on('exit', () => {
  dbStorage.closeDB();
});

