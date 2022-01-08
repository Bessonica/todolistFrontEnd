"use strict";

//нужно настроить handlebars для фастифай
// переименовать все handlebars в .hbs\
//fastify point of view
// после всего посатвь fastify helmet

//       starting to refactore code with fastify-express

// new code
// import Fastify from "fastify";
// import ExpressPlugin from "fastify-express";

import express from "express";

import exphbs from "express-handlebars";

// import PointOfView from "point-of-view";
// import handlebarsa from "handlebars";
const app = express();

// new code

// ------------ old code ----

//  const express = require("express");
//  const  app = express();
//  const exphbs  = require('express-handlebars');

// ------------ old code ----

// old code ----
//  const routes = require('./routes/routes.js');
//  let todoArr = require('./todoArr.js')
//  const mongoose = require('mongoose');
// old code ----

// new code
import routes from "./routes/routes.js";
// import todoArr from "./todoArr.js";
import mongoose from "mongoose";
// new code

//  --------                DATABASE        -------------
mongoose.Promise = global.Promise;

mongoose
    .connect("mongodb://localhost/todoMongo", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(function () {
        console.log("database connected");
    })
    .catch(function (err) {
        console.log("___  MONGODB ERR  ____");
        console.log(err);
        console.log("___  MONGODB ERR  ____");
    });

//console.log('database FAILED')
//  --------                DATABASE        -------------

// new code
// const fastify = Fastify({
//   logger: true,
// });

// await fastify.register(ExpressPlugin);

//new code

// везде где fastify, был app

// здесь важно    fastify.register(require('fastify-static')
//fastify.use(express.static('public'));

// fastify.register(PointOfView, {
//   engine: {
//     handlebars: handlebarsa
//   }
// });

app.use(express.static("public"));
//    handlebars part
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// !!!! в fastify не поставлен view engine
//app.set('view engine', 'handlebars');

//old
app.use("/", routes);

//     !!!!!!!!!!!!!!!!!!!!
//  await fastify.register(ExpressPlugin);

//  fastify.register(routes, { prefix: "/user" });

//  return fastify;
// }

app.listen(3000, function () {
    console.log("server is working");
});
console.log("just testing");
