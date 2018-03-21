import * as PIXI from 'pixi.js';
import Text from './Text.js';
import { getParam } from '../../helpers/url';


const DefaultImageUrl = '/files/assets/ui/woodenbutton.png';
const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

class Button extends PIXI.Sprite{
    constructor(props) {
        super(DefaultImage);
        let {
            image,
            text,
            Gui
        } = props;

        this.imageURL = image || getParam('imageURL') || DefaultImageUrl;
        if(Gui) {
            this.Gui = Gui;
            this.controller = Gui.add(this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        }

        this.anchor.set(0.5,0.5);
        this.interactive = true;
        this.buttonMode = true;

        this.textNode = new Text(props);
        this.addChild(this.textNode);

        this.loadImage(this.imageURL);
    }

    loadImage(img) {
        this.imageURL = img;
        this.setTexture(PIXI.Texture.fromImage(img));
    }

    setTexture(texture) {
        this.texture = texture;
    }

    _kill() {
        this.controller.remove();
        this.textNode._kill();
        this.destroy();
    }

    onClick(fn) {
        this.on('pointerdown', (e) => fn(e));
    }
}

export default Button;