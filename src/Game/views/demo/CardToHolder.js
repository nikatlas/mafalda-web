import * as PIXI from 'pixi.js';

import Card from '../base/Card';
import CardHolder from '../base/CardHolder';

class CardToHolder extends PIXI.Container{
    constructor(props) {
        super();

        let {GameLayer} = props;

        let card = new Card({GameLayer});
        this.addChild(card);
        
        let card2 = new Card({GameLayer, 'x': -200});
        this.addChild(card2);

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