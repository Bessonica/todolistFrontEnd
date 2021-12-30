'use strict'
 const express = require("express");
 const routes = require('./routes/routes.js');

 const  app = express();
 let todoArr = require('./todoArr.js')
 const exphbs  = require('express-handlebars');
 const mongoose = require('mongoose');

 mongoose.Promise = global.Promise;

 mongoose.connect('mongodb://localhost/todoMongo', { useNewUrlParser: true, useUnifiedTopology: true  })
 .then(function(){
  console.log('database connected');
}).catch(function(err){
  console.log("___  MONGODB ERR  ____");
  console.log(err);
  console.log("___  MONGODB ERR  ____");
});

//console.log('database FAILED')


app.use(express.static('public'));

 app.engine('handlebars', exphbs({defaultLayout: 'main'}));
 app.set('view engine', 'handlebars');
 app.use('/', routes);




app.listen(3000, function(){
  console.log('server is working');
});
console.log("just testing");