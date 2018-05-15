import * as PIXI from 'pixi.js';

import Card from '../base/Card';
import CardHolder from '../base/CardHolder';

class Board extends PIXI.Container{
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
        
        let view = new PIXI.Container();

        view.addChild(new CardHolder({GameLayer, 'x': -220, 'y': -230, team: 0, id: 4}).scaleTo(BoardScale));
        view.addChild(new CardHolder({GameLayer, 'x': -220, 'y': 0, team: 1, id: 5}).scaleTo(BoardScale));
        view.addChild(new CardHolder({GameLayer, 'x': -220, 'y': 230, team: 1, id: 4}).scaleTo(BoardScale));
        view.addChild(new CardHolder({GameLayer, 'x': -50, 'y': -230, team: 1, id: 5}).scaleTo(BoardScale));
        view.addChild(new CardHolder({GameLayer, 'x': -50, 'y': 0, team: 0, id: 2}).scaleTo(BoardScale));
        view.addChild(new CardHolder({GameLayer, 'x': -50, 'y': 230, team: 1, id: 3}).scaleTo(BoardScale));
        view.addChild(new CardHolder({GameLayer, 'x': 120, 'y': -230, team: 0, id: 1}).scaleTo(BoardScale));
        view.addChild(new CardHolder({GameLayer, 'x': 120, 'y': 0, team: 1, id: 3}).scaleTo(BoardScale));
        view.addChild(new CardHolder({GameLayer, 'x': 120, 'y': 230, team: 1, id: 3}).scaleTo(BoardScale));

        view.position.set(-200,0);
        this.addChild(view);

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

export default Board;