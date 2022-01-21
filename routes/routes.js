import todoArr from "../todoArr.js";
import Todo from "../models/mongoTodo.js";

import Sanitizer from "sanitizer";

const todoJobSchema = {
    schema: {
        body: {
            type: "object",
            properties: {
                description: { type: "string", maxLength: 20 },
                id: { type: "string" },
                over: { type: "boolean" },
                prior: { type: "integer", maximum: 100 },
            },
            required: ["description", "prior"],
            additionalProperties: false,
        },
    },
    attachValidation: true,
};

export default async function router(fastify) {
    fastify.get("/", (req, res) => {
        res.view("/views/index", { todoArr });
    });

    fastify.post("/todos", todoJobSchema, (req, res) => {
        console.log("todos");
        let dataSanitized = req.body;

        //show that form input is not accepted
        if (req.validationError) {
            res.code(400).send(req.validationError);
        }

        dataSanitized.description = Sanitizer.sanitize(
            dataSanitized.description
        );
        dataSanitized.prior = Sanitizer.sanitize(dataSanitized.prior);

        if (!dataSanitized.description || !dataSanitized.prior) {
            res.redirect("/");
            return;
        }

        let date = new Date();
        date = +date;
        dataSanitized.id = date;
        dataSanitized.date = new Date();

        console.log("BODY \n", dataSanitized);
        // console.log(typeof(req.body));

        todoArr.put(dataSanitized);
        console.log("dataSanitized arr \n", dataSanitized);

        let newTodo = new Todo({
            description: dataSanitized.description,
            prior: dataSanitized.prior,
            id: dataSanitized.id,
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
        console.log("input value \n", inputValue);
        if (inputValue === "вернуть") {
            let index = todoArr.over.findIndex(
                (element) => +element.id == req.params.id
            );
            todoArr.put(todoArr.over[index]);
            todoArr.over.splice(index, 1);

            // //mongoDB part
            Todo.findOneAndUpdate({ id: req.params.id }, { over: false });

            res.redirect("/");
            return;
        }

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
