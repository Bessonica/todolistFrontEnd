"use strict";

// new code

import todoArr from "../todoArr.js";
import Todo from "../models/mongoTodo.js";

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

        //mongoDB part
        let newTodo = new Todo({
            description: req.body.description,
            prior: req.body.prior,
            id: req.body.id,
        });

        newTodo.save().then(function (result) {
            console.log("mongoDB DATA \n", result, "\n end of mongoDB DATA");
        });

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

        //mongoDB part
        Todo.findOneAndUpdate(
            { id: req.params.id },
            { over: true },
            function (result) {
                console.log("mongodb result \n", result);
            }
        );

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

            //mongoDB part
            Todo.findOneAndUpdate(
                { id: req.params.id },
                { over: false },
                function (result) {
                    console.log("mongodb result \n", result);
                }
            );

            res.redirect("/");
        } else {
            console.log(inputValue);
            todoArr.over.forEach((element, i) => {
                if (req.params.id == +element.id) {
                    //  todoArr.put(element);
                    todoArr.over.splice(i, 1);
                }
            });

            //mongoDB part
            Todo.findOneAndDelete({ id: req.params.id }, function () {
                console.log("успешно удалена одна задача");
            });

            res.redirect("/");
        }

        console.log("___over___\n");
        console.log(todoArr);
    });

    fastify.post("/deleteAll", (req, res) => {
        //mongoDB part
        Todo.deleteMany({ over: false }, function () {
            //console.log('удалено на половину');
        });

        Todo.deleteMany({ over: true }, function () {
            //console.log('удалено на половину');
        });
        todoArr.pending = [];
        todoArr.over = [];
        console.log("deleteAll\n", todoArr);
        res.redirect("/");
    });
}
