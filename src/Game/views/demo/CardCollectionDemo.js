import * as PIXI from 'pixi.js';

import CardCollection from '../base/CardCollection';
import CollectionDeck from '../base/CollectionDeck';

class CardCollectionDemo extends PIXI.Container{
	constructor(){
		super();

		let cardCollection = new CardCollection({});
		this.addChild(cardCollection);
		let collectionDeck = new CollectionDeck({'x': 600, 'y':0 });
		this.addChild(collectionDeck);
	}

	getAsJSON = () => {return {component: 'demo/CardCollectionDemo'}}

	_kill() {
        super._kill();
    }
}

export default CardCollectionDemo;