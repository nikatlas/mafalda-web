import * as PIXI from 'pixi.js';
//import Text from './Text.js';
import { getParam } from '../../../helpers/url';

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
        window.MM = this;
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


        this._tween = PIXI.tweenManager.createTween(this);
        this._tween.time = 1000;
        this._tween.easing = PIXI.tween.Easing.outQuart();
        this._tween.loop = false;
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

    // Animate to Position
    moveTo(point, milliseconds=1000) {
        let path = new PIXI.tween.TweenPath();
        path.moveTo(this.position.x, this.position.y).lineTo(point.x, point.y);
        this._tween.path = path;
        this._tween.time = milliseconds;
        this._tween.start();
    }
    // Animate Scale
    scaleTo(newscale, milliseconds=1000) {
        this._tween.from({
            scale: { x: this.scale.x, y: this.scale.y }
        });
        this._tween.to({
            scale: { x: newscale, y: newscale }
        });
        this._tween.time = milliseconds;
        this._tween.start();
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