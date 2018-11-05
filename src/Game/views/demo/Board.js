import * as PIXI from 'pixi.js';

// import Game from '../../game/';

import BoardHandler from '../buildings/Board';
import DeckHandler from '../buildings/Deck';
import GameService from '../../services/GameService';
import UserService from '../../services/UserService';
import SocketService from '../../services/SocketService';

//import InputManager from '../../services/InputManager';

class BoardDemo extends PIXI.Container{
    constructor(props) {
        super();

        let {GameLayer} = props;
        
        let board = new BoardHandler({GameLayer, 'x': 0, 'y': 0 });
        this.addChild(board);

        let deck = new DeckHandler({GameLayer, 'x': 13, 'y': 275});
        this.addChild(deck);

        this.board = board;
        this.deck = deck;


        // let a = new InputManager.Action('test');
        // a.addCondition('g', true);
        // InputManager.createAction(a);
        // InputManager.onAction('test', () => {
        //     let stack = GameService.GameMachine.getStack();
        //     SocketService.emit('gameOver', stack);
        // });

        this.board.onCardPlaced = (position, card) => {
            GameService.playCard(position, card.id);
        }

        GameService.onInit = () => {
            console.log("GameService onInit : from './demo/Board.js'");
            console.log(GameService.state);
            this.deck.sync(GameService.state.cards, GameService.getMyTeam());
            this.board.sync(GameService.GameMachine);
            SocketService.to().on('winner', (winner) => {
                alert('Winner ' + winner);
                this.board.disable();
                SocketService.to().close();
            });
        }

        GameService.onUpdate = () => {
            console.log("GameService onUpdate : from './demo/Board.js'");
            this.deck.sync(GameService.state.cards, GameService.getMyTeam());
            this.board.sync(GameService.GameMachine);
            this.board.updateTimer(GameService.getLastTime(), this.outoftime.bind(this));
            // console.log("!!!Stack: ");
            // console.log(GameService.GameMachine.getStack());
        }

        GameService.onEnd = () => {
            console.log("Game Finished!");
            let winner = GameService.GameMachine.getWinner();

            const stack = GameService.GameMachine.getStack();
            console.log("Stack retrieved:");
            console.log(stack);
            SocketService.to().emit('gameOver', stack);
            console.log("EventEmmited!")

            if (winner === -1) {
                console.log("Tie");
            } else if (winner === UserService.getToken()) {
                console.log("You won!");
            } else {
                console.log("You lost!");
            }

        }
    }
    
    outoftime() {
        this.board.disable();
        
        SocketService.to().emit('outoftime', GameService.GameMachine.getStack());
        alert("Out of time");
    }

    update() {}

    _kill = () => {}

    getAsJSON = () => {return {component: 'demo/Board'}}
}

export default BoardDemo;