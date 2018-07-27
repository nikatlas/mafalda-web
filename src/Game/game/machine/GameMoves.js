class GameMove {    
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
    verify() {}
    performMove() {}
}
GameMove.TYPES = {
    PLACE: 1,
    PLACE_AND_REVEAL: 2,
    SELECT_CARDS: 0
};


class PlaceMove extends GameMove {
    constructor(card, position, player) {
        super(GameMove.TYPES.PLACE, {});
        this.position = position;
        this.card = card;
        this.player = player;
    }
    verify(state) {
        if (state.board.isEmpty(this.position)) {
            throw Error('Not a valid move, there is already a card there!');
        }

        return true;
    }

    performMove(board) {
        if(!board.isEmpty(this.position)) {
            console.log(this.position);
            console.log('Board');
            console.log(board);
            

            throw ('Tried to place a card on occupied holder!');
        }
        board.putCard(this.card, this.position, this.player);
    }
}

module.exports = {
    PlaceMove
};