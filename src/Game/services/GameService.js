import Game from '../game/';
import SocketService from '../services/SocketService';
import UserService from './UserService';

class GameService {
    constructor() {
        this.state = {
            cards: [],
            salts: [],
            moves: []
        };
        this.__enablePersistence = true;
    }

    saveToLocal(game) {
        this.game = game;
        let local = {
            setup: game,
            moves: []
        };
    }
    saveMoves() {
        let local = {
            setup: this.game,
            moves: this.state.moves
        }
        localStorage.setItem('currentgame', JSON.stringify(local));
    }
    loadFromLocal(game) {
        let local = JSON.parse(localStorage.getItem('currentgame'));
        if(local !== null && local !== undefined && local.setup !== null && local.setup !== undefined){
            if (game === local.setup) {
                for(var i=0; i<local.moves.length;i++) {
                    this.move(local.moves[i]);
                }
                return true;
            }
        }
        return false;
    }
    init(game) {
        this.GameMachine = new Game.GameMachine(game.setup);
        this.state.cards = game.cards.playerCardsArray;
        this.state.salts = game.cards.saltArray;

        if(this.onInit) this.onInit();
        SocketService.to().on('move', (data) => {
            console.log("New Move : ");
            console.log(data);
            this.move(data);
            this.saveMoves();
        });
        if(!this.loadFromLocal(game)) {
            this.saveToLocal(game);
        }
    }

    isMyTurn() {
        return this.GameMachine.isMyTurn(UserService.getToken());
    }

    getMyTeam() {
        return this.GameMachine.getMyTeam(UserService.getToken());
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
        let {id, timestamp, type} = data;

        this.setLastTime(timestamp); // Only here for round time!

        try{
            const move = new Game.GameMoves.Factory(data);
            this.GameMachine.runMove(move);
            this.state.moves.push(move.export());
            if(type === Game.GameMoves.TYPES.PLACE) {
                let ind = this.state.cards.indexOf(id);
                if(ind >= 0)
                    this.state.cards.splice(ind,1);
                console.log("My Cards:");
                console.log(this.state.cards);
            }
        } catch (e) {
            console.log(e);
            throw e;
        }

        // require UI Update where a card is placed and Board updated
        if(this.onUpdate) this.onUpdate(1);
        if(this.GameMachine.hasFinished()) {
            this.end();
        } else if (this.GameMachine.needFinalization() && this.isMyTurn()) {
            this.sendFinalization();
        }
    }

    sendFinalization() {
        try {
            const move = {
                type: Game.GameMoves.TYPES.REVEAL,
                id  : this.state.cards[0],
                player  : UserService.getToken()
            };
            SocketService.to().emit('broadcast', move);
        } catch(e) {
            console.log('[ /!\\ ] GameService: Cannot run Reveal Move!');
            throw e;
        }
    }

    end(data) {
        //SocketService.to().close();
        if(this.onEnd)
            this.onEnd();
    }
}

export default new GameService();