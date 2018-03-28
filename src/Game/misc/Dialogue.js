import * as PIXI from 'pixi.js';
import { getParam } from '../../helpers/url';


const DefaultImageUrl = '/files/assets/ui/woodenbutton.png';
const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

class Dialogue extends PIXI.Sprite{
    constructor(props) {
        super(DefaultImage);
        let {
            image,
            Gui
        } = props;

        this.imageURL = image || getParam('imageURL') || DefaultImageUrl;
        if(Gui) {
            this.Gui = Gui;
            let folder = Gui.addFolder("Button");
            this.controller = folder.add(this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        }

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

export default Dialogue;