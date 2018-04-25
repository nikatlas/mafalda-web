import * as PIXI from 'pixi.js';
import 'pixi-layers';

import CardCollection from '../base/CardCollection';
import CollectionDeck from '../base/CollectionDeck';

class CardCollectionDemo extends PIXI.Container{
	constructor(){
		super();

		var layer = new PIXI.display.Layer();

		let cardCollection = new CardCollection({});
		this.addChild(cardCollection);
		let collectionDeck = new CollectionDeck({'x': 600, 'y':0 });
		this.addChild(collectionDeck);
		// this.setChildIndex(collectionDeck, 0);
		// this.setChildIndex(cardCollection,1);
	}

	_kill() {
        
    }

	getAsJSON = () => {return {component: 'demo/CardCollectionDemo'}}
}

export default CardCollectionDemo;