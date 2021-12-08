'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let todoSchema = new Schema({
  description: {
    type :String,
    required : true
  },
  prior : {
    type: Number,
    required: true
  },
  over :{
    type: Boolean,
    default : false
  },
  id: String,
});

module.exports = mongoose.model('Todo', todoSchema);
