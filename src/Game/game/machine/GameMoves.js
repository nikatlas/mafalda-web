const Card = require('./Card.js');

class GameMove {    
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
    verify() {}
    performMove() {}
    export() {}
}
GameMove.TYPES = {
    PLACE: 1,
    REVEAL: 2,
    SELECT_CARDS: 0
};


class PlaceMove extends GameMove {
    constructor(card, position, player) {
        super(GameMove.TYPES.PLACE, {});
        this.position = position;
        this.card = card;
        this.player = player;
    }

    export() {
        return {
            type        : GameMove.TYPES.PLACE,
            id          : this.card.id,
            salt        : this.card.salt,
            signature   : this.player,
            position    : this.position
        };
        // Add signature!
    }

    getPlayer() { return this.player; }
    verify(state) {
        if (!state.board.isEmpty(this.position)) {
            throw Error('Not a valid move, there is already a card there!');
        }
        // Verify the hash of the card to be sure it was there from the beginning
        return true;
    }

    performMove(board) {
        if(!board.isEmpty(this.position)) {
            console.log(this.position);
            console.log('Board');
            console.log(board);
            

            let err = { msg: 'Tried to place a card on occupied holder!' };
            throw err;
        }
        board.putCard(this.card, this.position, this.player);
    }
}

class RevealMove extends GameMove {
    constructor(card, player) {
        super(GameMove.TYPES.REVEAL, {});
        this.card = card;
        this.player = player;
    }

    export() {
        return {
            type        : GameMove.TYPES.REVEAL,
            id          : this.card.id,
            salt        : this.card.salt,
            signature   : this.player
        };
    }

    getPlayer() { return this.player; }
    verify(state) {
        if (state.stacks.hashes.length !== 9) {
            console.log(state);
            throw Error('Not a valid move, Need to play all cards to reveal!');
        }
        // TODO - Verify the last card from hashes
        return true;
    }

    performMove() {
        console.log('Reveal move processed');
    }
}

function Factory(move) {
    let type = move.type;
    switch(type) {
    case GameMove.TYPES.PLACE:
        return new PlaceMove(new Card(move.id, move.salt), move.position, move.signature);
    case GameMove.TYPES.REVEAL:
        return new RevealMove(new Card(move.id, move.salt), move.signature);
    default: return {};
    }
}

module.exports = {
    PlaceMove,
    RevealMove,
    Factory,
    TYPES: GameMove.TYPES
};