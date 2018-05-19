import * as PIXI from 'pixi.js';

import Card from '../base/Card';
import Injector from '../../services/Injector';
import BoardStage from './Board';

class BoardPlayDemo extends PIXI.Container{
    constructor(props) {
        super();

        let {GameLayer} = props;


        let stage = new BoardStage(props);
        this.addChild(stage);

        
        for(var i=0;i<5;i++) {
            let rn = parseInt((Math.random()*1000) % 6);
            let card = new Card({GameLayer, id:rn});
            let t = i;
            stage.deck.getHolder(t).occupy(card);
            // setTimeout(() => ) , 100);

            this.addChild(card);
        }

    }

    _kill = () => {
    }

    getAsJSON = () => {return {component: 'demo/BoardPlay'}}
}

export default BoardPlayDemo;