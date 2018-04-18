import * as PIXI from 'pixi.js';
//import Text from './Text.js';
import { getParam } from '../../../helpers/url';

import draggable from '../../../helpers/draggable';
import dragAndDrop from '../../../helpers/dragAndDrop';

import GuiableContainer from '../../../helpers/Guiable';

const DefaultImageUrl = '/files/assets/ui/woodenbutton.png';
const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

class Card extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            image,
            x,
            y
        } = props;

        // Properties Component 
        this.imageURL = image || getParam('imageURL') || DefaultImageUrl;
        this.position.set(x,y);

        this.x = x || 0;
        this.y = y || 0;

        // GUI
        this.addFolder('Card');
        this.addToFolder('Card', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('Card', this, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('Card', this, 'y').onFinishChange((v) => this.position.y = v);
        //

        this.construct(props);
    }

    construct(props) {
        let [w,h] = [200,320];

        this.sprite = new PIXI.Sprite(DefaultImage);
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.width = w;
        this.sprite.height= h;

        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(-w/2,-h/2,w,h);
        this.cursor = 'pointer';

        this.addChild(this.sprite);
        dragAndDrop(this);

        this.loadImage(this.imageURL);
    }

    loadImage(img) {
        this.imageURL = img;
        this.setTexture(PIXI.Texture.fromImage(img));
    }

    setTexture(texture) {
        this.sprite.texture = texture;
    }

    onClick(fn) {
        this.sprite.on('pointerdown', (e) => fn(e));
    }

    _kill() {
        super._kill();
    }

    getAsJSON() {
        return {
            component: 'base/Card',
            image: this.imageURL,
            x: this.position.x,
            y: this.position.y
        };
    }
}

export default Card;