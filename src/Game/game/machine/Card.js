// import fckn generator to check different Distributions
var dg = require('./deckGenerator').createRandomDeck;
let deck = dg();

class Card {
    constructor(id = 0, salt = 'emptysalt') {
        this.attack = deck[id];
        this.id = id;
        this.salt = salt;
    }

    setAttack(attack) {
        this.attack = attack;
    }

    setOwner(owner) {
        this.owner = owner;
    }
}

module.exports = Card;