import * as PIXI from 'pixi.js';
import 'pixi-layers';

import CardCollection from '../base/CardCollection';
import CollectionDeck from '../base/CollectionDeck';

class CardCollectionDemo extends PIXI.Container{
	constructor(props){
		super();

		let {
			GameLayer
		} = props;

		var layer = new PIXI.display.Layer();
		var layer2 = new PIXI.display.Layer();
		let cardCollection = new CardCollection({});
		//cardCollection.parentLayer = layer;
		layer.addChild(cardCollection);
		cardCollection.zIndex = 1;
		// this.addChild(cardCollection);
		let collectionDeck = new CollectionDeck({'x': 600, 'y':0 });
		//collectionDeck.parentLayer = layer;
		layer2.addChild(collectionDeck);
		collectionDeck.zIndex = 2;
		// this.addChild(collectionDeck);
		GameLayer.app.stage.addChild(layer2);
		GameLayer.app.stage.addChild(layer);
		
		this.addChild(layer);
		this.addChild(layer2);
		// this.setChildIndex(collectionDeck, 0);
		// this.setChildIndex(cardCollection,1);
	}

	_kill() {
        
    }

	getAsJSON = () => {return {component: 'demo/CardCollectionDemo'}}
}

export default CardCollectionDemo;