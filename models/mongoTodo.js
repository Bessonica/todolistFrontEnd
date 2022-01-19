"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

let todoSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    prior: {
        type: Number,
        required: true,
    },
    over: {
        type: Boolean,
        default: false,
    },
    id: String,
});

const modelExp = mongoose.model("Todo", todoSchema);
export default modelExp;
