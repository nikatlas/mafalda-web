import * as PIXI from 'pixi.js';
import Text from './Text.js';
import { getParam } from '../../../helpers/url';

import GuiableContainer from '../../../helpers/Guiable';



const DefaultImageUrl = '/files/assets/ui/woodenbutton.png';
const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

class Button extends GuiableContainer{
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
        this.addFolder('Button');
        this.addToFolder('Button', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('Button', this, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('Button', this, 'y').onFinishChange((v) => this.position.y = v);
        // 


        this.construct(props);
    }

    construct(props) {
        this.sprite = new PIXI.Sprite(DefaultImage);
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;

        //draggable(this.sprite);
        this.textNode = new Text({...(props.Text|| {}), Gui: props.Gui});
        this.sprite.addChild(this.textNode);
        this.addChild(this.sprite);

        this.loadImage(this.imageURL);        

        this.setText = this.textNode.setText; // Pass setText;
    }

    scaleTo(x) {
        this.scale.set(x);
        return this;
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
        //this.sprite.on('mouseup', (e) => fn(e));
        return this;
    }


    _kill() {
        this.textNode._kill();
        super._kill();
    }

    getAsJSON() {
        return {
            component: 'misc/Button',
            Text: this.textNode.getAsJSON(),
            image: this.imageURL,
            x: this.position.x,
            y: this.position.y
        };
    }
}

export default Button;