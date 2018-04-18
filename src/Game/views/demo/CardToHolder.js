import * as PIXI from 'pixi.js';

import Card from '../base/Card';
import CardHolder from '../base/CardHolder';

class CardToHolder extends PIXI.Container{
    constructor() {
        super();

        let card = new Card({});
        this.addChild(card);
        let card2 = new Card({'x': -200});
        this.addChild(card2);

        let holder = new CardHolder({'x':-170,'y':0,'w':203,'h':323});
        this.addChild(holder);

        let holder2 = new CardHolder({'x':200,'y':100,'w':203,'h':323});
        this.addChild(holder2);
    }

    getAsJSON = () => {return {component: 'demo/CardToHolder'}}
}

export default CardToHolder;