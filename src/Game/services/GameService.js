import Game from '../game/';
import SocketService from '../services/SocketService';

class GameService {
    constructor() {
        this.state = {
            cards: [],
            salts: [],
            setup: {}
        };
        this.stack = [];

        this.__enablePersistence = true;
    }

    init(game) {
        this.GameMachine = new Game.GameMachine();
        this.stack = [];
        this.state.cards = game.mycards.ids;
        this.state.salts = game.mycards.salts;
        this.state.setup = game.setup;

        if(this.onInit) this.onInit();
        SocketService.on('move', this.move);
    }

    move(data) {
        // Game Machine perform internal Move

        let {cardid, position, player} = data;

        const card = new Game.Card(cardid);
        const move = new Game.GameMoves.PlaceMove(card, position, player);
        try{
            this.GameMachine.performMove(move);
        } catch(e) {
            console.log(e);
            throw e;
        }
        // require UI Update where a card is placed and Board updated
        if(this.onUpdate) this.onUpdate(1);
    }


}

export default new GameService();