import * as PIXI from 'pixi.js';
import config from '../../config';

import GuiableContainer from '../../../helpers/Guiable';
import Deck from '../../assets/deck';
import CardHolder from '../base/CardHolder';

class CollectionHandler extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            x,
            y,
            id
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
        
        this.construct(props);
    }

    construct(props) {
        let {
            id,
            team,
            GameLayer
        } = props;
        
        let CollectionScale = 0.35;
        this.cards = [];

        this.cards.push(new CardHolder({GameLayer, 'x': 160, 'y': -230, team: 0, id: 3}).scaleTo(CollectionScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 160, 'y': 0, team: 1, id: 1}).scaleTo(CollectionScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 0, 'y': -230, team: 1, id: 5}).scaleTo(CollectionScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 0, 'y': 0, team: 1, id: 4}).scaleTo(CollectionScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 80, 'y': 230, team: 1, id: 3}).scaleTo(CollectionScale));
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
            component: 'buildings/Collection',
            x:  this.position.x,
            y:  this.position.y,
            id: this.options.id,
            team: this.options.team
        };
    }
}

export default CollectionHandler;