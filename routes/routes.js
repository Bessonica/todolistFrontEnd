import todoArr from '../todoArr.js';
import Todo from '../models/mongoTodo.js';

import Sanitizer from 'sanitizer';

//санитизировать данніе
//  хендлинг ошибок
// eslint, у metaarhia хороший линт есть.только для ноды
//
// // атомарніми более маленькими
//

const todoJobSchema = {
    schema: {
        body: {
            type: 'object',
            properties: {
                description: { type: 'string', maxLength: 20 },
                id: { type: 'string' },
                over: { type: 'boolean' },
                prior: { type: 'integer', maximum: 100 },
            },
            required: ['description', 'prior'],
            additionalProperties: false,
        },
    },
    attachValidation: true,
};

export default async function router(fastify) {
    fastify.get('/', (req, res) => {
        res.view('/views/index', { todoArr });
    });

    fastify.get('/error', (req, res) => {
        const textLength =
            todoJobSchema.schema.body.properties.description.maxLength;
        const priorLength = todoJobSchema.schema.body.properties.prior.maximum;

        let message = 'there is an unknown mistake';
        const defaultMsg = `Описание: максимум ${textLength} 
        символов.приоритет: максимум число ${priorLength}.`;
        if (
            todoArr.error.message ===
            'body.description should NOT be longer than 20 characters'
        ) {
            message =
                'Твоя задача слишком длинная (максимум = ' + textLength + ' )';
        } else {
            message =
                'Твой приоритет слишком велик (максимум = ' +
                priorLength +
                ' )';
        }
        res.view('/views/error', { message, defaultMsg });
    });

    fastify.post('/todos', todoJobSchema, (req, res) => {
        console.log('todos');
        const dataSanitized = req.body;
        todoArr.error = [];

        //show that form input is not accepted
        if (req.validationError) {
            todoArr.error = [];
            todoArr.error = req.validationError;
            res.redirect('/error');
            return;
        }

        // хендлинг ошибок

        dataSanitized.description = Sanitizer.sanitize(
            dataSanitized.description
        );
        dataSanitized.prior = Sanitizer.sanitize(dataSanitized.prior);

        // хендлинг ошибок
        if (!dataSanitized.description || !dataSanitized.prior) {
            // хендлинг ошибок
            res.redirect('/');
            return;
        }

        let date = new Date();
        date = +date;
        dataSanitized.id = date;
        dataSanitized.date = new Date();

        console.log('BODY \n', dataSanitized);
        // console.log(typeof(req.body));

        todoArr.put(dataSanitized);
        console.log('dataSanitized arr \n', dataSanitized);

        const newTodo = new Todo({
            description: dataSanitized.description,
            prior: dataSanitized.prior,
            id: dataSanitized.id,
        });

        newTodo.save().then((result) => {
            console.log('mongoDB DATA \n', result, '\n end of mongoDB DATA');
        }); // хендлинг ошибок

        res.redirect('/');
    });

    fastify.post('/pending/:id', (req, res) => {
        const index = todoArr.pending.findIndex(
            (element) => element.id === +req.params.id
        );
        todoArr.over.push(todoArr.pending[index]);
        todoArr.pending.splice(index, 1);

        console.log('pending\n', todoArr);

        // //mongoDB part
        Todo.findOneAndUpdate({ id: req.params.id }, { over: true });
        // хендлинг ошибок .cathc !!!!
        //////!!!!!!!

        res.redirect('/');
    });

    fastify.post('/over/:id', (req, res) => {
        //САНИТИЗИРОВАТЬ !!!!!
        const inputValue = req.body.getBack;
        console.log('input value \n', inputValue);

        if (inputValue === 'вернуть') {
            const index = todoArr.over.findIndex(
                (element) => element.id === +req.params.id
            );
            todoArr.put(todoArr.over[index]);
            todoArr.over.splice(index, 1);

            // //mongoDB part
            Todo.findOneAndUpdate({ id: req.params.id }, { over: false });
            // хендлинг ошибок .cathc !!!!

            res.redirect('/');
            return;
        }

        console.log(inputValue);

        const index = todoArr.over.findIndex(
            (element) => +element.id === req.params.id
        );
        todoArr.over.splice(index, 1);

        // //mongoDB part
        Todo.findOneAndDelete({ id: req.params.id }, () => {
            console.log('успешно удалена одна задача');
        });
        // хендлинг ошибок .cathc !!!!

        res.redirect('/');
    });

    fastify.post('/deleteAll', (req, res) => {
        // хендлинг ошибок .cathc !!!!

        // //mongoDB part

        //нужен clone
        //Mongoose no longer allows executing the same query object twice.

        Todo.deleteMany({}, () => {})
            .clone()
            .catch((error) => {
                console.log('delete many ERROR \n', error);
            });

        // ИСПРАВИТЬ УДАЛЕНИЕ +++ хендлинг ошибок

        // Todo.deleteMany({ over: true }, () => {
        //     //console.log('удалено на половину');
        // });
        todoArr.pending = [];
        todoArr.over = [];
        console.log('deleteAll\n', todoArr);
        res.redirect('/');
    });
}
