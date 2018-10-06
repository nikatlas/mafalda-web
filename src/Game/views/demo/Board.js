import * as PIXI from 'pixi.js';

import BoardHandler from '../buildings/Board';
import DeckHandler from '../buildings/Deck';
import GameService from '../../services/GameService';
import UserService from '../../services/UserService';
import SocketService from '../../services/SocketService';



class BoardDemo extends PIXI.Container{
    constructor(props) {
        super();

        let {GameLayer} = props;
        
        let board = new BoardHandler({GameLayer, 'x': -250, 'y': 0 });
        this.addChild(board);

        let deck = new DeckHandler({GameLayer, 'x': 380, 'y': 0});
        this.addChild(deck);

        this.board = board;
        this.deck = deck;

        this.board.onCardPlaced = (position, card) => {
            const move = {
                cardid  : card.id,
                position: position,
                player  : UserService.getToken()
            };
            SocketService.emit('broadcast', move);
        }

        GameService.onInit = () => {
            console.log("GameService onInit : from './demo/Board.js'");
            this.deck.sync(GameService.state.cards, GameService.getMyTeam());
            this.board.sync(GameService.GameMachine);
        }

        GameService.onUpdate = () => {
            console.log("GameService onUpdate : from './demo/Board.js'");
            this.board.sync(GameService.GameMachine);
            this.board.updateTimer(GameService.getLastTime(), this.outoftime.bind(this));
            console.log("!!!Stack: ");
            console.log(GameService.GameMachine.getStack());
        }

        GameService.onEnd = () => {
            console.log("Game Finished!");
            let winner = GameService.GameMachine.getWinner();
            
            SocketService.emit('gameOver', GameService.GameMachine.getStack());

            if (winner == -1) {
                console.log("Tie");
            } else if (winner == UserService.getToken()) {
                console.log("You won!");
            } else {
                console.log("You lost!");
            }
        }
    }
    
    outoftime() {
        this.board.disable();
        
        SocketService.emit('outoftime', GameService.GameMachine.getStack());
        alert("Out of time");
    }

    update() {}

    _kill = () => {}

    getAsJSON = () => {return {component: 'demo/Board'}}
}

export default BoardDemo;