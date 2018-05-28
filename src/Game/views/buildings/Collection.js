import * as PIXI from 'pixi.js';
// import config from '../../config';
import GuiableContainer from '../../../helpers/Guiable';

import CardHolder from '../base/CardHolder';

import Button from '../misc/Button.js';
//to be deleted
import Card from '../base/Card.js';

const DefaultImageUrl = '/files/assets/ui/papyrus.jpg';
const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);


class CollectionHandler extends GuiableContainer{
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
        this.addFolder('Collection');
        //this.addToFolder('Deck', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('Collection', this.options, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('Collection', this.options, 'y').onFinishChange((v) => this.position.y = v);

        this.addUI(props);
        
        this.construct(props);
    }

    construct(props) {
        let {
            GameLayer
        } = props;
        
        this.GameLayer = GameLayer;
        let CollectionScale = 0.35;
        this.cards = [];
        
        //to be deleted
        let [w,h] = [800,600];

        this.sprite = new PIXI.Sprite(DefaultImage);
        this.sprite.anchor.set(0,0);
        this.sprite.width = w;
        this.sprite.height= h;
        
        this.addChild(this.sprite);
        let card = new Card({'x':100, 'y':120});
        card.zIndex = 4;
        this.addChild(card);
        //
        this.addUI(props);
        this.position.set(-500,-320);

        this.cards.push(new CardHolder({GameLayer, 'x': 160, 'y': -230, team: 0, id: 3}).scaleTo(CollectionScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 160, 'y': 0, team: 1, id: 1}).scaleTo(CollectionScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 0, 'y': -230, team: 1, id: 5}).scaleTo(CollectionScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 0, 'y': 0, team: 1, id: 4}).scaleTo(CollectionScale));
        this.cards.push(new CardHolder({GameLayer, 'x': 80, 'y': 230, team: 1, id: 3}).scaleTo(CollectionScale));
        this.cards.forEach((c) => c.show());
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

    addUI(props){
        let leftButton = new Button({GameLayer: this.GameLayer, Text: {text: 'Alerta'}, 'x': 130, 'y': 540});
        leftButton.scale.set(0.3);
        this.addChild(leftButton.onClick(() =>{
            window.alert('kostas');
        }));
        let rightButton = new Button({GameLayer: this.GameLayer, Text: {text: 'Alerta'}, 'x': 130, 'y': 540});
        rightButton.scale.set(0.3);
        this.addChild(rightButton.onClick(() =>{
            window.alert('kostas');
        }));
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