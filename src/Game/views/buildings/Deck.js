import * as PIXI from 'pixi.js';
// import config from '../../config';

import GuiableContainer from '../../../helpers/Guiable';
// import Deck from '../../assets/deck';
import CardHolder from '../base/CardHolder';

// import GameService from '../../services/GameService';

import Card from '../base/Card';

const debug = (a) => {
    console.log(a);
}

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

        let DeckScale = 0.7;
        this.cards = [];
        this.cardsMap = {};

        this.cards.push(new CardHolder({GameLayer, 'x': -200, 'y': 0, team: 0, id: 3}).scaleTo(DeckScale));
        this.cards.push(new CardHolder({GameLayer, 'x': -100, 'y': 0, team: 1, id: 1}).scaleTo(DeckScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 0, 'y': 0, team: 1, id: 5}).scaleTo(DeckScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 100, 'y': 0, team: 1, id: 4}).scaleTo(DeckScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 200, 'y': 0, team: 1, id: 3}).scaleTo(DeckScale));
        //this.cards.forEach((c) => c.cloak());
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

    setTeam(team) {
        this.cards.forEach((item) => item.setTeam(team));
    }

    sync(cards, team) {
        if(!cards)return;
        let temp = cards.map((card) => card.id);
        debug("-----------------------------------------");
        debug("Syncing deck with:");
        debug(temp);
        this.cards.forEach((holder, index) => {
            if(!holder.isEmpty()) {
                let card = holder.getCard();
                if (temp.indexOf(card.id) > -1) {
                    const index = temp.indexOf(card.id);
                    temp.splice(index, 1);
                } else {
                    card.destroy();
                }
            }
        });

        debug("Cards: ");
        debug(cards);
        debug("Missing cards: ");
        debug(temp);
        
        temp.forEach((id, index) => {
            const card = new Card({id});
            card.setTeam(team);
            this.addCard(card);
            this.addChild(card);
        });
        debug("-----------------------------------------");
    }

    addCard(card) {
        for (var i=0; i < this.cards.length; i++) {
            if(this.cards[i].isEmpty()){
                debug("Holder " + i + " is empty adding card");
                this.cards[i].occupy(card);
                card.zoomable = true;
                // card.onMouseOver(this.zoomEffect);
                // card.onMouseOut(this.unzoomEffect);
                return;
            }
        }
        debug("Cannot Add card no space...");
        // throw "Cannot Add card no space...";
    }

    zoomEffect(e) {
        if(e.target.dragging)return;
        console.log("zoomEffect");
        const npos = new PIXI.Point();
        npos.copy(e.target.position);
        npos.y = -100;
        e.target.zIndex = 1000;
        e.target.moveTo(npos,500);
        e.target.scaleTo(1.5 ,500);
    }

    unzoomEffect(e) {
        if(e.currentTarget.dragging)return;
        console.log("unzoomEffect");
        e.currentTarget.zIndex = 10;
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