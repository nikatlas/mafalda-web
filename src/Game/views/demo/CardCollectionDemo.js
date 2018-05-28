import * as PIXI from 'pixi.js';
import 'pixi-layers';

import Injector from '../../services/Injector';

//import CardCollection from '../base/CardCollection';
import Collection from '../buildings/Collection';
import CollectionDeck from '../base/CollectionDeck';


class CardCollectionDemo extends PIXI.Container{
	constructor(props){
		super();


		let collection = new Collection({'x':0, 'y':0});
		collection.parentLayer = Injector.getByName('MainLayer');
		this.addChild(collection);

		let collectionDeck = new CollectionDeck({'x': 500, 'y':0 });
		this.addChild(collectionDeck);
	}

	_kill() {
    }

	getAsJSON = () => {return {component: 'demo/CardCollectionDemo'}}
}

export default CardCollectionDemo;