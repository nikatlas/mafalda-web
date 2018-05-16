import * as PIXI from 'pixi.js';
import config from '../../config';

import GuiableContainer from '../../../helpers/Guiable';
import Deck from '../../assets/deck';
import CardHolder from '../base/CardHolder';

class Board extends GuiableContainer{
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
        this.addFolder('Board');
        //this.addToFolder('Board', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('Board', this.options, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('Board', this.options, 'y').onFinishChange((v) => this.position.y = v);
        
        this.construct(props);
    }

    construct(props) {
        let {
            id,
            team,
            GameLayer
        } = props;
        
        let BoardScale = 0.35;
        // Board BG
        let bg = new PIXI.Sprite(PIXI.Texture.fromImage('/files/assets/board_wood.jpg'));
        bg.position.set(-700,-500);
        bg.scale.set(1.75);
        this.addChild(bg);

        this.holders = [];
        this.holders.push(new CardHolder({GameLayer, 'x': -220, 'y': -230, team: 0, id: 4}).scaleTo(BoardScale).onDrop(() => this.placeCard(0)));
        this.holders.push(new CardHolder({GameLayer, 'x': -50, 'y': -230, team: 1, id: 5}).scaleTo(BoardScale).onDrop(() => this.placeCard(1)));
        this.holders.push(new CardHolder({GameLayer, 'x': 120, 'y': -230, team: 0, id: 1}).scaleTo(BoardScale).onDrop(() => this.placeCard(2)));
        this.holders.push(new CardHolder({GameLayer, 'x': -220, 'y': 0, team: 1, id: 5}).scaleTo(BoardScale).onDrop(() => this.placeCard(3)));
        this.holders.push(new CardHolder({GameLayer, 'x': -50, 'y': 0, team: 0, id: 2}).scaleTo(BoardScale).onDrop(() => this.placeCard(4)));
        this.holders.push(new CardHolder({GameLayer, 'x': 120, 'y': 0, team: 1, id: 3}).scaleTo(BoardScale).onDrop(() => this.placeCard(5)));
        this.holders.push(new CardHolder({GameLayer, 'x': -220, 'y': 230, team: 1, id: 4}).scaleTo(BoardScale).onDrop(() => this.placeCard(6)));
        this.holders.push(new CardHolder({GameLayer, 'x': -50, 'y': 230, team: 1, id: 3}).scaleTo(BoardScale).onDrop(() => this.placeCard(7)));
        this.holders.push(new CardHolder({GameLayer, 'x': 120, 'y': 230, team: 1, id: 3}).scaleTo(BoardScale).onDrop(() => this.placeCard(8)));

        this.holders.forEach((item) => this.addChild(item));
    }

    getCard(x,y) {
        return this.holders[3*y+x].getCard();
    }

    placeCard(position) {
        this.holders[position].getCard();
    }

    onClick(fn) {
        this.sprite.on('pointerdown', (e) => fn(e));
    }

    _kill() {
        super._kill();
    }

    getAsJSON() {
        return {
            component: 'buildings/Board',
            x:  this.position.x,
            y:  this.position.y,
            id: this.options.id,
            team: this.options.team
        };
    }
}

export default Board;