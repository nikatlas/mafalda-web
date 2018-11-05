import Game from '../game/';
import SocketService from '../services/SocketService';
import UserService from './UserService';


const debug = (a) => {
    if(false)console.log(a);
}
class GameService {
    constructor() {
        this.state = {
            cards: []
        };
        this.__enablePersistence = true;
    }

    saveToLocal(game) {
        this.game = game;
        // let local = {
        //     setup: game,
        //     moves: []
        // };
    }
    saveMoves() {
        let local = {
            setup: this.game,
            //moves: this.state.moves // get moves from game machine 
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
        debug("Game initializing... ");
        debug(game);
        this.GameMachine = new Game.GameMachine(game.setup);

        let cards = game.personal.cards.playerCardsArray;
        let salts = game.personal.cards.saltArray;
        this.state.cards = [];
        salts.forEach((salt, index) => {
            this.state.cards.push({ salt, id: cards[index]}); // THATS MY CARDS FROM BEGINNING
        });

        if (game.stack && game.stack.moves && game.stack.hashes) {
            debug("[GS] Bootstraping");
            // Supress sending the moves to the socket 
            this.bootstrapMoves(game.stack);
        }

        if(this.onInit) this.onInit();
        SocketService.to().on('move', (data) => {
            debug("New Move : ");
            debug(data);
            this.move(data);
            //this.saveMoves();
        });
        // if(!this.loadFromLocal(game)) {
        //    // this.saveToLocal(game);
        // }
    }

    bootstrapMoves(stack) {
        let { moves } = stack;
        debug("Bootstraping");
        debug(moves);
        try {
            for (var i=0; i < moves.length; i++) {
                let move = moves[i];
                this.move(move);
            }
        } catch (e) {
            throw Error('[GS] Cannot reconnect : Error on stack');
        }
    }



    move(data) {
        // Game Machine perform internal Move
        let {timestamp} = data;

        this.setLastTime(timestamp); // Only here for round time!

        try{
            const move = new Game.GameMoves.Factory(data);
            this.GameMachine.runMove(move);
            let myplayedcards = this.GameMachine.getMyPlayedCards(UserService.getToken());
            this.updateMyCards(myplayedcards);
        } catch (e) {
            console.log(e);
            throw e;
        }

        debug("Moved performed!");
        debug(data);
        debug(this.state.cards);

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
            debug('[ /!\\ ] GameService: Cannot run Reveal Move!');
            throw e;
        }
    }

    end(data) {
        //SocketService.to().close();
        if(this.onEnd)
            this.onEnd();
    }

///////////////////////////////////////////////////////////////////////////
// helpers
    playCard(position, card) {
        // find one hand card to send!
        if(!this.isMyTurn()) {
            return;
        }
        let mycard = this.state.cards.reduce((a,b) => b.id === card ? b : a, null);
        if (mycard === null) return false;
        const move = {
            type: Game.GameMoves.TYPES.PLACE,
            id  : mycard.id,
            salt: mycard.salt,
            position: position,
            signature  : UserService.getToken()
        };
        this.move(move);                            // internal
        SocketService.to().emit('broadcast', move); // external
    }

    updateMyCards(played) {
        let mappedCards = this.state.cards.map((c) => c.id + c.salt);
        let playedMappedCards = played.map((c) => c.id + c.salt);
        playedMappedCards.forEach((card, index) => {
            const ind = mappedCards.indexOf(card);
            if(ind > -1) {
                this.state.cards.splice(ind, 1);
            }
        })
    }

    isMyTurn() {return this.GameMachine.isMyTurn(UserService.getToken());}
    getMyTeam(){return this.GameMachine.getMyTeam(UserService.getToken());}
////////////////////////////////////////////////////////////////////////////
// misc
    setLastTime(time) {
        this.state.timestamp = time;
    }
    getLastTime() { return this.state.timestamp; }
    elapsedTime() { 
        const now = new Date().getTime();
        return now - this.state.timestamp;
    }

}

export default new GameService();