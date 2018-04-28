import * as PIXI from 'pixi.js';
import 'pixi-layers';

import Injector from '../../services/Injector';

import CardCollection from '../base/CardCollection';
import CollectionDeck from '../base/CollectionDeck';

class CardCollectionDemo extends PIXI.Container{
	constructor(props){
		super();

		let {
			GameLayer
		} = props;


		let cardCollection = new CardCollection({});
		cardCollection.parentLayer = Injector.getByName("MainLayer");
		this.addChild(cardCollection);

		let collectionDeck = new CollectionDeck({'x': 500, 'y':0 });
		this.addChild(collectionDeck);
	}

	_kill() {
        
    }

	getAsJSON = () => {return {component: 'demo/CardCollectionDemo'}}
}

export default CardCollectionDemo;