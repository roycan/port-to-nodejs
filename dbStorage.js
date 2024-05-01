const levelup = require('levelup');
const leveldown = require('leveldown')

// 1) Create our store  / open the DB
const db = levelup(leveldown('./mydb'))


function samplePutGet() {
  // 2) Put a key & value
  db.put('name', 'levelup', function (err) {
    if (err) return console.log('Ooops!', err) // some kind of I/O error

    // 3) Fetch by key
    db.get('name', function (err, value) {
      if (err) return console.log('Ooops!', err) // likely the key was not found

      // Ta da!
      console.log('name=' + value)
    })
  })

}


//////////// localStorage commands

function length(callback) { 
  return new Promise( function (resolve, reject) {
    let count = 0;
    db.createReadStream()
      .on('data', function (){
        count++;
      })
      .on('end', function () {
        resolve(count);
      })
      .on('error', function(err){
        console.log('error geting length: ', err);
        reject(err);
      })
  })

}


function key(n) {
  return new Promise (function (resolve, reject){
    let count = 0;
    db.createReadStream()
      .on('data', function(data){
        if (count === n) {
          resolve(data);
        }
        count++;
      })
      .on('end', function (){
        if (count < n){
          reject('Record NOT found!')
        }
      })
      .on('error', function(err){
        reject(err);
      })

  })

}

function getKeys() {
  // returns an array of keys in the LevelDB database
  return new Promise(function (resolve, reject) {
    const keys = [];
    db.createReadStream()
      .on('data', function (data) {
        keys.push(data.key.toString());
      })
      .on('end', function () {
        resolve(keys);
      })
      .on('error', function (err) {
        console.log("error on getting keys: ", err);
        reject(err);
      })
  })
}



function setItem(key, value) {
  // sample usage: 
  //    dbStorage.setItem('name1', name);
  return new Promise( function (resolve, reject){
    db.put(key, value)
      .then(function () {
        resolve();
      })
      .catch(function(err){
        console.log("Error in saving item: ", err)
        reject(err);
      })
  })
}



function getItem(key) {
  return new Promise(function(resolve, reject){
    db.get(key)
      .then(function(value){
        resolve(value);
      })
      .catch(function(err){
        console.log('Error in retrieving item: ', err);
        reject(err);
      })
  })
}


function getAll(){
  return new Promise(function (resolve, reject) {
    const entries = {};

    db.createKeyStream()
      .on('data', function(key){
        getItem(key)
          .then(function(value){
            try{
              const objectData = JSON.parse(value);
              entries[key] = objectData;
            }
            catch{
              entries[key] = value;
            }
            
          })
      })
      .on('end', function(){
        resolve(entries);
      })
      .on('error', function(err){
        reject(err);
      })
  })
}


function delItem(key) {
  return new Promise (function (resolve, reject){
    db.del(key)
      .then(function (){
        resolve();
      })
      .catch(function (err){
        reject(err);
      })
  })
  
}


function clear() {
  return new Promise(function(resolve, reject){
    db.createKeyStream()
      .on('data', function (key){
        db.del(key)
          .catch(function (err){
            console.error(`Error deleting key: ${key}`, err);
          })
      })
      .on('end', function(){
        console.log("All records deleted!");
        resolve();
      })
      .on('error', function(err){
        reject(err);
      })
  }) 

}


function closeDB() {
  db.close((error) => {
    if (error) {
      console.error('Error closing database:', error);
    } else {
      console.log('Database closed');
    }
  });
}




module.exports.length = length;
module.exports.getKeys = getKeys;
module.exports.key = key;
module.exports.getItem = getItem;
module.exports.setItem = setItem;
module.exports.delItem = delItem;
module.exports.clear = clear;
module.exports.closeDB = closeDB;
module.exports.samplePutGet = samplePutGet;
module.exports.getAll = getAll;
