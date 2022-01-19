"use strict";

import Fastify from "fastify";

import PointOfView from "point-of-view";
import FastifyStatic from "fastify-static";
import handlebars from "handlebars";
import FastifyFormbody from "fastify-formbody";

import path from "path";
const __dirname = path.resolve();

import routes from "./routes/routes.js";
import mongoose from "mongoose";
import "dotenv/config";

const mongoUri = process.env.MONGODB_URI;

mongoose
    .connect(mongoUri, {
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

const PORT = process.env.PORT || 3000;
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

const start = async () => {
    try {
        await fastify.listen(PORT, address);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
