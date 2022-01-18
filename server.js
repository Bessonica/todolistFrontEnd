"use strict";

//нужно настроить handlebars для фастифай
// переименовать все handlebars в .hbs\
//fastify point of view
// после всего посатвь fastify helmet

//       starting to refactore code with fastify-express

import Fastify from "fastify";

import PointOfView from "point-of-view";
import FastifyStatic from "fastify-static";
import handlebars from "handlebars";
import FastifyFormbody from "fastify-formbody";

import path from "path";
const __dirname = path.resolve();

import routes from "./routes/routes.js";
import mongoose from "mongoose";

//  --------                DATABASE        -------------
// mongoose.Promise = global.Promise;

// mongoose
//     .connect("mongodb://localhost/todoMongo", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(function () {
//         console.log("database connected");
//     })
//     .catch(function (err) {
//         console.log("___  MONGODB ERR  ____");
//         console.log(err);
//         console.log("___  MONGODB ERR  ____");
//     });

// //console.log('database FAILED')
//  --------                DATABASE        -------------

const PORT = process.env.PORT || 3000 ;
const address = "0.0.0.0";
const fastify = Fastify({});

fastify.register(FastifyFormbody);

fastify.register(PointOfView, {
    engine: {
        handlebars: handlebars,
    },
    includeViewExtension: true,
    options: {},
});

fastify.register(FastifyStatic, {
    root: path.join(__dirname, "/public"),
    prefix: "/public/", // optional: default '/'
});

//fastify.use("/", routes);
fastify.register(routes, { prefix: "/" });

fastify.listen(PORT, address, (error)=>{
    if (error != null){
        console.log(error);
    }
    
});

// try {
//     await fastify.listen(PORT);
// } catch (error) {
//     fastify.log.error(error);
//     //fastify.log("there is an error ");
//     process.exit(1);
// }
