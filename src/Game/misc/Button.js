import * as PIXI from 'pixi.js';

import Text from './Text.js';
import { getParam } from '../../helpers/url';

import GuiableContainer from '../../helpers/Guiable';

const DefaultImageUrl = '/files/assets/ui/woodenbutton.png';
const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

class Button extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            image
        } = props;

        this.imageURL = image || getParam('imageURL') || DefaultImageUrl;
  
        this.addFolder('Button');
        this.addToFolder('Button', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('Button', this.position, 'x').onFinishChange((v) => this.position.x = v).listen();
        this.addToFolder('Button', this.position, 'y').onFinishChange((v) => this.position.y = v).listen();
        
        this.construct(props);
    }

    construct(props) {
        this.sprite = new PIXI.Sprite(DefaultImage);
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;

        //draggable(this.sprite);

        this.textNode = new Text(props);
        this.sprite.addChild(this.textNode);
        this.addChild(this.sprite);

        this.loadImage(this.imageURL);        
    }

    loadImage(img) {
        this.imageURL = img;
        this.setTexture(PIXI.Texture.fromImage(img));
    }

    setTexture(texture) {
        this.texture = texture;
    }

    onClick(fn) {
        this.on('pointerdown', (e) => fn(e));
    }


    _kill() {
        this.textNode._kill();
        super._kill();
    }

    getAsJSON = () => {
        return {
            image: this.imageURL,
            ...this.textNode.getAsJSON(),
            x: this.position.x,
            y: this.position.y,
            component: 'Button'
        }
    }
}

export default Button;