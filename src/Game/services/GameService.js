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

    isMyTurn() {
        return this.GameMachine.isMyTurn(UserService.getToken());
    }

    getMyTeam() {
        return this.state.setup.id.indexOf(UserService.getToken());
    }

    setLastTime(time) {
        this.state.timestamp = time;
    }

    getLastTime() { return this.state.timestamp; }
    elapsedTime() { 
        const now = new Date().getTime();
        return now - this.state.timestamp;
    }

    move(data) {
        // Game Machine perform internal Move
        let {cardid, position, player, timestamp} = data;

        this.setLastTime(timestamp); // Only here for round time!

        const card = new Game.Card(cardid);
        const move = new Game.GameMoves.PlaceMove(card, position, player);
        
        try{
            this.GameMachine.runMove(move);
            let ind = this.state.cards.indexOf(cardid);
            this.state.cards.splice(ind,1);
        } catch (e) {
            console.log(e);
            throw e;
        }

        // require UI Update where a card is placed and Board updated
        if(this.onUpdate) this.onUpdate(1);
        if(this.GameMachine.hasFinished()) this.end();
        else if(this.GameMachine.needFinalization() && this.GameMachine.isMyTurn()) this.sendFinalization();
    }

    sendFinalization() {
        const card = new Game.Card(this.state.cards[0]);
        const move = new Game.GameMoves.RevealMove(card, UserService.getToken());
        try {
            this.GameMachine.runMove(move);
            SocketService.emit('broadcast', move);
            this.end();
        } catch(e) {
            console.log("[ /!\\ ] GameService: Cannot run Reveal Move!");
            throw e;
        }
    }

    end(data) {
        SocketService.close();
        if(this.onEnd)
            this.onEnd();
    }
}

export default new GameService();