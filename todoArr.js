'use strict'



let todoArr = {
  pending: [],
  over: [],
  put: function(element) {
    if (this.pending.length === 0) {
      this.pending.push(element);
    } else if (this.pending.length === 1) {
      if (element.prior <= this.pending[0].prior) {
        this.pending.unshift(element);
        return;
      } else {
        this.pending.push(element);
//  должен здесь быть return?
      }
    } else {
      let flag;
      for (let i = 0; i < +this.pending.length; i++) {
        if (+element.prior >= +this.pending[i].prior) {//<=
          flag = i;
          console.log(flag);
          console.log(this.pending.length);
        }
      }
      if (flag+1 == 0) {//flag
        this.pending.unshift(element);
      } else {
        this.pending.splice(flag + 1, 0, element);
      }
    }
  }
};

/*
todoArr.pending.length= 30;
todoArr.over.length = 30;
*/
module.exports = todoArr;
