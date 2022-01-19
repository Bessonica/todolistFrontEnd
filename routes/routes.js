"use strict";

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
            req.body.id = date;
            req.body.date = new Date();

            todoArr.put(req.body);
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
        let index = todoArr.pending.findIndex(
            (element) => element.id == req.params.id
        );
        todoArr.over.push(todoArr.pending[index]);
        todoArr.pending.splice(index, 1);

        console.log("pending\n", todoArr);

        // //mongoDB part
        Todo.findOneAndUpdate({ id: req.params.id }, { over: true });

        res.redirect("/");
    });

    fastify.post("/over/:id", (req, res) => {
        let inputValue = req.body.getBack;
        console.log(inputValue);
        if (inputValue === "вернуть") {
            let index = todoArr.over.findIndex(
                (element) => +element.id == req.params.id
            );
            todoArr.put(todoArr.over[index]);
            todoArr.over.splice(index, 1);

            // //mongoDB part
            Todo.findOneAndUpdate({ id: req.params.id }, { over: false });

            res.redirect("/");
        } else {
            console.log(inputValue);

            let index = todoArr.over.findIndex(
                (element) => +element.id == req.params.id
            );
            todoArr.over.splice(index, 1);

            // //mongoDB part
            Todo.findOneAndDelete({ id: req.params.id }, function () {
                console.log("успешно удалена одна задача");
            });

            res.redirect("/");
        }

        console.log("___over___\n");
        console.log(todoArr);
    });

    fastify.post("/deleteAll", (req, res) => {
        // //mongoDB part
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
