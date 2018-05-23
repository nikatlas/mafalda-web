import * as PIXI from 'pixi.js';
//import { getParam } from '../../../helpers/url';

import CardHolder from './CardHolder';
import Card from './Card';
import EventManager from '../../services/EventManager';
import Injector from '../../services/Injector';

//const DefaultImageUrl = '/files/assets/ui/woodenbutton.png';
//const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

import config from '../../config.js';

class CollectionHolder extends CardHolder {
    constructor(props) {
        super(props);
        let {
            counter,
            zInit,
            cardNumber,
            GameLayer,
            deckNumber
        } = props;

        // Properties Component 
        this.counter = counter || 0;
        this.z = zInit || 10;
        this.cardNumber = cardNumber;
        this.GameLayer = GameLayer;
        this.deckNumber = deckNumber || 0;
        // this.count = 0;

        this.construct(props);

        this.appear();
        this.uncloak();
        this.show();
        
        this.unsetEvents();
        this.refresh();
    }

    setEvents() {
        this.sprite.on('mouseup', this._placeFn);
        this.sprite.on('touchend',this._placeFn);
    }

    unsetEvents() {
        this.sprite.off('mouseup', this._placeFn);
        this.sprite.off('touchend',this._placeFn);
    }

    createCard() {
        let card = new Card({GameLayer: this.GameLayer, id:this.cardNumber});
        card.zIndex = this.z;
        card.attach(this);
        this.cards.push(card);
        this.z -= 1;
    }

    remove(){
        //when you place card in deck
        this.cards.pop();
        this.z += 1;
        if (this.counter - this.deckCards >0){
            this.createCard();
        }
    }

    deckRemoval(){
        //when you remove card from deck and it is added to collectionm, if you have only one copy in collection, add another copy
        if (this.counter - this.deckCards <2){
            this.createCard();
        }
    }

    lock() {

    }

    unlock() {

    }

    createCardGrey(){
        let card = new Card({GameLayer: this.GameLayer, id:this.cardNumber});
        card.zIndex = this.z - 5;
        card.attach(this);
        card.unsetEvents();
    }

    refresh(){
        this.createCardGrey();
        this.cards = [];
        this.z = this.zInit || 10;
        for (let i =0; i<2 && i<this.counter - this.deckCards; ){
            this.createCard(); 
        }
    }

}

export default CollectionHolder;
