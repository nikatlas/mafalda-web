// import fckn generator to check different Distributions
var dg = require('../../../helpers/deckGenerator').createRandomDeck;

let deck = dg();

class Card {
    constructor(id = 0) {
        this.attack = deck[id];
    }

    setAttack(attack) {
        this.attack = attack;
    }

    setOwner(owner) {
        this.owner = owner;
    }
}

module.exports = Card;