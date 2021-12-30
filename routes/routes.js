'use strict'


const router = require('express').Router();

let todoArr = require('../todoArr.js')
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const Todo = require('../models/mongoTodo.js');


router.get('/', (req, res)=>{
  res.render('index', {
    todoArr
  });
});

router.post("/todos", urlencodedParser, function (req, res) {

    if(!req.body.description || !req.body.prior )
    { res.redirect('/');}
    else{


    let date = new Date();
    date =+date;
  //  console.log(date);
    req.body.id = date;
    req.body.date = new Date();
//    console.log(req.body);

    todoArr.put(req.body); //  todoArr.pending.push(req.body);
  console.log("ЭТО ROUTER(line 33)")
  console.log(todoArr);
  console.log('КОнец вызова');
  //  res.redirect('/');

};

//mongoDb part
        let newTodo = new Todo({
          description: req.body.description,
          prior: req.body.prior,
          id:req.body.id
        });

        newTodo.save().then(function(result){
          console.log('mongoDB DATA \n', result,'\n end of mongoDB DATA');
        });

//mongoDb part
res.redirect('/');

});

//добавь сохранени задач в локальную память браузера,был простой гайд по написанию тудулиста,где это обьяснялось
router.post("/pending/:id" , (req, res)=>{ //?.post?

//console.log(req.params.id);


todoArr.pending.forEach((element, i)=>{
 if(req.params.id == element.id){
  todoArr.over.push(element);
  todoArr.pending.splice(i, 1);
  console.log(todoArr);
 };
});

//mongoDb part

/*
Todo.find({ id: req.params.id }).exec().then( function(result){
  //result.over = true;
  //let data = JSON.parse(result);

  console.log('mongoDB result \n'+ result);
  //console.log('Checking data', Todo);
// result.save();
}).catch(function(err){console.log('Pending Error',err);});
*/


Todo.findOneAndUpdate({id: req.params.id},{over: true},function(result){
  console.log('mongodb result \n', result);
});
//mongoDb part


  //переместить задачу из pending  в done и переместить задачу в список сделанного(handlebars файл) (не забудь его сделать)
  res.redirect('/');

});

router.post("/over/:id" ,urlencodedParser, (req, res)=>{

let inputValue = req.body.getBack;
console.log(inputValue);
if(inputValue == 'вернуть'){
  todoArr.over.forEach((element, i)=>{
   if(req.params.id == +element.id){
    todoArr.put(element);
    todoArr.over.splice(i, 1);
   };
  })
//mongodb part
Todo.findOneAndUpdate({id: req.params.id},{over: false},function(result){
  console.log('mongodb result \n', result);
});

//mongodb part

  res.redirect('/');

}else{
  console.log(inputValue);
    todoArr.over.forEach((element, i)=>{
     if(req.params.id == +element.id){
    //  todoArr.put(element);
      todoArr.over.splice(i, 1);
     };
    })
//mongoDB part
Todo.findOneAndDelete({ id: req.params.id},function(result){
  console.log('успешно удалена одна задача');
});

//mongodb part


    res.redirect('/');
}

});

//удаляем все данные
router.post("/deleteAll" ,urlencodedParser, (req, res)=>{
  Todo.deleteMany({over:false},function(result){
    //console.log('удалено на половину');
  });

  Todo.deleteMany({over:true},function(result){
    //console.log('удалено на половину');
  });


todoArr.pending = [];
todoArr.over = [];
//console.log('удаленный массив todoArr \n', todoArr.pending,'\n',todoArr.over);
  res.redirect('/');
});


module.exports = router;
