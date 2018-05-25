// import * as PIXI from 'pixi.js';
// import config from '../../config';

import GuiableContainer from '../../../helpers/Guiable';
// import Deck from '../../assets/deck';
import CardHolder from '../base/CardHolder';
import EventManager from '../../services/EventManager';

class DeckHandler extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            x,
            y
        } = props;

        // Properties Component 
        //this.imageURL = image || getParam('imageURL');
        this.position.set(x,y);
        this.options = {
            x: x || 0,
            y: y || 0,
        };

        // GUI
        this.addFolder('Deck');
        //this.addToFolder('Deck', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('Deck', this.options, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('Deck', this.options, 'y').onFinishChange((v) => this.position.y = v);
        
        EventManager.on('increaseDeckCards', this.increaseCardCounter, this._card.id);
        EventManager.on('removeDeckCards',this.decreaseCardCounter, this._card.id);

        this.construct(props);
    }

    construct(props) {
        let {
            GameLayer
        } = props;
        
        let DeckScale = 0.35;
        this.cards = [];
        this.cardsMap = {};

        this.cards.push(new CardHolder({GameLayer, 'x': 160, 'y': -230, team: 0, id: 3}).scaleTo(DeckScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 160, 'y': 0, team: 1, id: 1}).scaleTo(DeckScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 0, 'y': -230, team: 1, id: 5}).scaleTo(DeckScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 0, 'y': 0, team: 1, id: 4}).scaleTo(DeckScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 80, 'y': 230, team: 1, id: 3}).scaleTo(DeckScale));
        this.cards.forEach((c) => c.cloak());
        this.cards.forEach((c) => this.addChild(c));

    }

    getHolder(x) {
        return this.cards[x];
    }
    
    getCard(x) {
        return this.cards[x].getCard();
    }

    _kill() {
        super._kill();
    }

    getAsJSON() {
        return {
            component: 'buildings/Deck',
            x:  this.position.x,
            y:  this.position.y,
            id: this.options.id,
            team: this.options.team
        };
    }

    increaseCardCounter(id){
        if (this.cardsMap(id)){
            this.cardsMap[id] += 1;
        }
        else {
            this.cardsMap[id] = 1; 
        }
    }

    decreaseCardCounter(id){
        this.cardsMap[id] -= 1;
        if (this.cardsMap[id] === 0){
            delete this.cardsMap[id];
        }
    }
}

export default DeckHandler;