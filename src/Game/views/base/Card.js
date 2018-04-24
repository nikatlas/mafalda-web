import * as PIXI from 'pixi.js';
//import Text from './Text.js';
import { getParam } from '../../../helpers/url';

import dragAndDrop from '../../../helpers/dragAndDrop';

import GuiableContainer from '../../../helpers/Guiable';

import Deck from '../../assets/deck';



const BlueURL = '/files/assets/cards/frame_blue.png';
const BlueImage = PIXI.Texture.fromImage(BlueURL);

const RedURL = '/files/assets/cards/frame_red.png';
const RedImage = PIXI.Texture.fromImage(RedURL);

const LabelURL = '/files/assets/cards/label.png';
const LabelImage = PIXI.Texture.fromImage(LabelURL);

class Card extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            image,
            x,
            y
        } = props;

        // Properties Component 
        this.imageURL = image || getParam('imageURL');
        this.position.set(x,y);

        this.x = x || 0;
        this.y = y || 0;

        // GUI
        this.addFolder('Card');
        this.addToFolder('Card', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('Card', this, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('Card', this, 'y').onFinishChange((v) => this.position.y = v);
        this.addToFolder('Card', {team: false}, 'team').onFinishChange((v) => this.setTeam(v));
        this.addToFolder('Card', {card: 0}, 'card', 0, 1).onFinishChange((v) => this.loadCard(v));
        //

        this.construct(props);
    }

    construct(props) {
        let [w,h] = [494,683];

        this.sprite = new PIXI.Sprite();
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.width = w;
        this.sprite.height= h;

        this.frame = new PIXI.Sprite(BlueImage);
        this.frame.anchor.set(0.5,0.5);
        this.frame.width = w;
        this.frame.height= h;
        //this.frame.setTexture(RedImage);

        let [lw,lh] = [1983/12,737/12];
        this.label = new PIXI.Sprite(LabelImage);
        this.label.anchor.set(0.5,0.5);
        this.label.width = lw;
        this.label.height= lh;
        this.label.position.set(0,100);


        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(-w/2,-h/2,w,h);
        this.cursor = 'pointer';

        this.addChild(this.sprite);
        this.addChild(this.label);
        this.addChild(this.frame);
        dragAndDrop(this);

        this.loadCard(0);
    }

    setTeam(team) {
        switch(team) {
            case 0: case 'R': case 'r': case false:
                this.frame.setTexture(RedImage);
                break;
            case 1: case 'B': case 'b': case true:
                this.frame.setTexture(BlueImage);
                break;
            default:break;
        }
    }

    loadCard(number) {
        this.imageURL = Deck.Filenames[number];
        this.setTexture(Deck.Textures[number]);
    }

    setTexture(texture) {
        this.sprite.setTexture(texture);
    }

    onClick(fn) {
        this.sprite.on('pointerdown', (e) => fn(e));
    }

    // Animate to Position
    moveTo(point, milliseconds=1000) {
        let path = new PIXI.tween.TweenPath();
        path.moveTo(this.position.x, this.position.y).lineTo(point.x, point.y);
        this._tween = PIXI.tweenManager.createTween(this);
        this._tween.easing = PIXI.tween.Easing.outQuart();
        this._tween.loop = false;
        this._tween.path = path;
        this._tween.time = milliseconds;
        this._tween.start();
    }
    // Animate Scale
    scaleTo(newscale, milliseconds=1000) {
        this._tween = PIXI.tweenManager.createTween(this);
        this._tween.easing = PIXI.tween.Easing.outQuart();
        this._tween.loop = false;
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