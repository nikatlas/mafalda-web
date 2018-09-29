// import * as PIXI from 'pixi.js';
// import config from '../../config';

import GuiableContainer from '../../../helpers/Guiable';
// import Deck from '../../assets/deck';
import CardHolder from '../base/CardHolder';

import Card from '../base/Card';


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

        this.construct(props);
    }

    construct(props) {
        let {
            GameLayer
        } = props;
        
        this.GameLayer = GameLayer;

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

    draw() {
        for(var i=0;i<5;i++) {
            if(!this.getHolder(i).isEmpty())continue;
            let rn = parseInt((Math.random()*1000) % 6, 10);
            let card = new Card({GameLayer: this.GameLayer, id:rn});
            let t = i;
            this.getHolder(t).occupy(card);
            // setTimeout(() => ) , 100);
            this.addChild(card);
        }
    }

    sync(cards) {
        if(!cards)return;
        this.cards.forEach((holder, index) => {
            const card = new Card({id: cards[index]});
            this.addChild(card);
            card.attach(holder);
        });
    }

    lock() {
        this.cards.forEach((c,i) => {
            if(!c.isEmpty()){
                c.getCard().lock();
            }
        });
    }
    
    unlock() {
        this.cards.forEach((c,i) => {
            if(!c.isEmpty()){
                c.getCard().unlock();
            }
        });
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
}

export default DeckHandler;