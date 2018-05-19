import * as PIXI from 'pixi.js';

import Card from '../base/Card';
import CardHolder from '../base/CardHolder';
import CollectionHandler from '../buildings/Collection';
import DeckHandler from '../buildings/Deck';
import Injector from '../../services/Injector';

class CollectionDemo extends PIXI.Container{
    constructor(props) {
        super();

        let {GameLayer} = props;


        let card = new Card({GameLayer, 'x': 100, 'y': -230, team: 0, id: 4}).scaleTo(0.27);
        card.parentLayer = Injector.getByName('MainLayer');
        this.addChild(card);
        
        let collection = new CollectionHandler({GameLayer, 'x': -250, 'y': 0 });
        this.addChild(collection);

        // let holder2 = new Card({'x':200,'y':100, 's': 0.7, id: 3});
        // this.addChild(holder2);

        let deck = new DeckHandler({GameLayer, 'x': 380, 'y': 0});
        this.addChild(deck);

        this.collection = collection;
        this.deck = deck;
    }

    _kill = () => {

    }

    getAsJSON = () => {return {component: 'demo/Collection'}}
}

export default CollectionDemo;