import * as PIXI from 'pixi.js';

import Card from '../base/Card';
import CardHolder from '../base/CardHolder';
import Board from '../buildings/Board';

class BoardDemo extends PIXI.Container{
    constructor(props) {
        super();

        let {GameLayer} = props;

        let BoardScale = 0.35,
            DeckScale = 0.35;
        // Board BG
        let bg = new PIXI.Sprite(PIXI.Texture.fromImage('/files/assets/board_wood.jpg'));
        bg.position.set(-700,-500);
        bg.scale.set(1.75);
        this.addChild(bg);

        // let card = new Card({GameLayer});
        // this.addChild(card);
        this.addChild(new Card({GameLayer, 'x': -220, 'y': -230, team: 0, id: 4}).scaleTo(0.27));
        
        let board = new Board({GameLayer, 'x': -250, 'y': 0 });
        this.addChild(board);

        let deck = new PIXI.Container();

        deck.addChild(new CardHolder({GameLayer, 'x': 160, 'y': -230, team: 0, id: 3}).scaleTo(DeckScale));
        deck.addChild(new CardHolder({GameLayer, 'x': 160, 'y': 0, team: 1, id: 1}).scaleTo(DeckScale));
        deck.addChild(new CardHolder({GameLayer, 'x': 0, 'y': -230, team: 1, id: 5}).scaleTo(DeckScale));
        deck.addChild(new CardHolder({GameLayer, 'x': 0, 'y': 0, team: 1, id: 4}).scaleTo(DeckScale));
        deck.addChild(new CardHolder({GameLayer, 'x': 80, 'y': 230, team: 1, id: 3}).scaleTo(DeckScale));
        deck.position.set(380,0);
        this.addChild(deck);

        // let holder = new CardHolder({'x':-170,'y':0, 's': 0.4});
        // this.addChild(holder);

        let holder2 = new CardHolder({'x':200,'y':100, 's': 0.7});
        //this.addChild(holder2);
        holder2.onDrop((card) => 0);
    }

    _kill = () => {

    }

    getAsJSON = () => {return {component: 'demo/Board'}}
}

export default BoardDemo;