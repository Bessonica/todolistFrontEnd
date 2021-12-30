'use strict'



let todoArr = {
  pending: [],
  over: [],
  put: function(element) {
    // if (this.pending.length === 0) {
    //   this.pending.push(element);
    //   return;
    // }; 

    //если только один элемент
    // if ((this.pending.length === 1) ) {
    //   this.pending.sort((i1, i2)=> i1.prior - i2.prior);
      
    //     this.pending.unshift(element);
    //     return;

    // };
      
       
    this.pending.push(element);

    this.pending.sort((i1, i2)=> i1.prior - i2.prior);
    



      // let flag;
      // for (let i = 0; i < +this.pending.length; i++) {

      //   if (+element.prior >= +this.pending[i].prior) {//<=
      //     flag = i;
      //     console.log(flag);
      //     console.log(this.pending.length);
      //   }
      // }

      // if (flag+1 == 0) {//flag
      //   this.pending.unshift(element);
      //   return;
      // }; 

      // this.pending.splice(flag + 1, 0, element);
      // return;
      
    
  }
};

/*
todoArr.pending.length= 30;
todoArr.over.length = 30;
*/
module.exports = todoArr;
