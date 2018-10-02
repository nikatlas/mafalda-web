import Game from '../game/';
import SocketService from '../services/SocketService';
import UserService from './UserService';

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
        this.state.cards = game.cards.playerCardsArray;
        this.state.salts = game.cards.saltArray;
        this.state.setup = game.setup;

        this.GameMachine.setPlayers(game.setup.id);

        if(this.onInit) this.onInit();
        SocketService.on('move', (data) => this.move(data));
        SocketService.on('result', (data) => this.end(data));
    }

    getMyTeam() {
        return this.state.setup.id.indexOf(UserService.getToken());
    }

    move(data) {
        // Game Machine perform internal Move
        let {cardid, position, player} = data;

        const card = new Game.Card(cardid);
        const move = new Game.GameMoves.PlaceMove(card, position, player);
        try{
            this.GameMachine.runMove(move);
        } catch (e) {
            console.log(e);
            throw e;
        }
        // require UI Update where a card is placed and Board updated
        if(this.onUpdate) this.onUpdate(1);
    }

    end(data) {
        SocketService.close();
    }
}

export default new GameService();