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
                cardid: card.id,
                position: position,
                player: UserService.getUsername()
            };
            SocketService.emit('broadcast', move);
        }

        GameService.onInit = () => {
            this.deck.sync(GameService.state.cards);
        }

        GameService.onUpdate = () => {
            this.board.sync(GameService.GameMachine.state.board);
        }
    }

    update() {}

    _kill = () => {}

    getAsJSON = () => {return {component: 'demo/Board'}}
}

export default BoardDemo;