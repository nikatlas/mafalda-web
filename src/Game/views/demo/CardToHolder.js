import * as PIXI from 'pixi.js';

import Card from '../base/Card';
import CardHolder from '../base/CardHolder';

class CardToHolder extends PIXI.Container{
    constructor(props) {
        super();

        let {GameLayer} = props;

        // let card = new Card({GameLayer});
        // this.addChild(card);
        
        let view = new PIXI.Container();

        view.addChild(new Card({GameLayer, 'x': -220, 'y': -230, team: 0, id: 4}));
        view.addChild(new Card({GameLayer, 'x': -220, 'y': 0, team: 1, id: 5}));
        view.addChild(new Card({GameLayer, 'x': -220, 'y': 230, team: 1, id: 4}));
        view.addChild(new Card({GameLayer, 'x': -50, 'y': -230, team: 1, id: 5}));
        view.addChild(new Card({GameLayer, 'x': -50, 'y': 0, team: 0, id: 2}));
        view.addChild(new Card({GameLayer, 'x': -50, 'y': 230, team: 1, id: 3}));
        view.addChild(new Card({GameLayer, 'x': 120, 'y': -230, team: 0, id: 1}));
        view.addChild(new Card({GameLayer, 'x': 120, 'y': 0, team: 1, id: 3}));
        view.addChild(new Card({GameLayer, 'x': 120, 'y': 230, team: 1, id: 3}));

        view.position.set(-200,0);
        this.addChild(view);


        let deck = new PIXI.Container();

        deck.addChild(new Card({GameLayer, 'x': -180, 'y': -230, team: 0, id: 3}).scaleTo(0.27));
        deck.addChild(new Card({GameLayer, 'x': -180, 'y': -50, team: 1, id: 1}).scaleTo(0.27));
        deck.addChild(new Card({GameLayer, 'x': -50, 'y': -230, team: 1, id: 5}).scaleTo(0.27));
        deck.addChild(new Card({GameLayer, 'x': -50, 'y': -50, team: 1, id: 4}).scaleTo(0.27));
        deck.addChild(new Card({GameLayer, 'x': -120, 'y': 130, team: 1, id: 3}).scaleTo(0.27));
        deck.position.set(610,110);
        this.addChild(deck);


        let holder = new CardHolder({'x':-170,'y':0,'w':203,'h':323});
        this.addChild(holder);

        let holder2 = new CardHolder({'x':200,'y':100,'w':203,'h':323});
        this.addChild(holder2);
        holder2.onDrop((card) => 0);
    }

    _kill = () => {

    }

    getAsJSON = () => {return {component: 'demo/CardToHolder'}}
}

export default CardToHolder;