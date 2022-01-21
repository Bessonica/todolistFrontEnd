const todoArr = {
    pending: [],
    over: [],
    put(element) {
        this.pending.push(element);
        this.pending.sort((i1, i2) => i1.prior - i2.prior);
    },
    error: [],
};

export default todoArr;
