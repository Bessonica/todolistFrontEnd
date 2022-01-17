"use strict";

// new code

import express from "express";
//const router = express.Router();

import todoArr from "../todoArr.js";
import bodyParser from "body-parser";
//const urlencodedParser = bodyParser.urlencoded({ extended: false });
import Todo from "../models/mongoTodo.js";

// new code

//   old code -----
//const router = require('express').Router();

// let todoArr = require('../todoArr.js')
// const bodyParser = require("body-parser");
// const urlencodedParser = bodyParser.urlencoded({extended: false});
// const Todo = require('../models/mongoTodo.js');

export default async function router(fastify) {
    fastify.get("/", (req, res) => {
        res.view("/views/index", { todoArr });
    });

    fastify.post("/todos", (req, res) => {
        console.log("todos");

        if (!req.body.description || !req.body.prior) {
            res.redirect("/");
        } else {
            let date = new Date();
            date = +date;
            //  console.log(date);
            req.body.id = date;
            req.body.date = new Date();
            //    console.log(req.body);

            todoArr.put(req.body); //  todoArr.pending.push(req.body);
            console.log("ЭТО ROUTER(line 33)");
            console.log(todoArr);
            console.log("КОнец вызова");
            //  res.redirect('/');
        }

        res.redirect("/");
    });

    fastify.post("/pending/:id", (req, res) => {
        todoArr.pending.forEach((element, i) => {
            if (req.params.id == element.id) {
                todoArr.over.push(element);
                todoArr.pending.splice(i, 1);
                console.log(todoArr);
            }
        });

        console.log("pending\n", todoArr);

        res.redirect("/");
    });

    fastify.post("/over/:id", (req, res) => {
        let inputValue = req.body.getBack;
        console.log(inputValue);
        if (inputValue == "вернуть") {
            todoArr.over.forEach((element, i) => {
                if (req.params.id == +element.id) {
                    todoArr.put(element);
                    todoArr.over.splice(i, 1);
                }
            });

            res.redirect("/");
        } else {
            console.log(inputValue);
            todoArr.over.forEach((element, i) => {
                if (req.params.id == +element.id) {
                    //  todoArr.put(element);
                    todoArr.over.splice(i, 1);
                }
            });

            res.redirect("/");
        }

        console.log("___over___\n");
        console.log(todoArr);
    });

    fastify.post("/deleteAll", (req, res) => {
        todoArr.pending = [];
        todoArr.over = [];
        console.log("deleteAll\n", todoArr);
        res.redirect("/");
    });
}
