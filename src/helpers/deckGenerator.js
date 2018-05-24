let Zigg = require('./generator');

// var seed = 1;

let gen = new Zigg();
function random() {
    // var x = Math.sin(seed++) * 10000;
    // return (x - Math.floor(x))* 123456;
    let n =  gen.nextGaussian() * 2 + 4.5;
    return n;
}
function r9() {
    return (parseInt( random(), 10) % 9) + 1;
}

function createRandomDeck() {
    let a = [];
    for(var j=0;j<100;j++){
        let b = [];
        for(var i=0;i<4;i++){
            b[i] = r9();
        }
        a.push(b);
    }
    return a;
}


module.exports = {random, Zigg, createRandomDeck};