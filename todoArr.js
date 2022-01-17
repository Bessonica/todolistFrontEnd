"use strict";

let todoArr = {
    pending: [],
    over: [],
    put: function (element) {
        this.pending.push(element);
        this.pending.sort((i1, i2) => i1.prior - i2.prior);
    },
};

/*
todoArr.pending.length= 30;
todoArr.over.length = 30;
*/
//module.exports = todoArr;
export default todoArr;
