import * as PIXI from 'pixi.js';
import Text from './Text.js';

class Button extends PIXI.Sprite{
    constructor(props) {
        super(PIXI.Texture.fromImage('/files/assets/ui/woodenbutton.png'));
        let {
            image,
            text,
            Gui
        } = props;

        this.anchor.set(0.5,0.5);
        this.interactive = true;
        this.buttonMode = true;

        this.textNode = new Text(props);
        this.addChild(this.textNode);
    }


    _kill() {
        this.destroy();
    }

    onClick(fn) {
        this.on('pointerdown', (e) => fn(e));
    }
}

export default Button;