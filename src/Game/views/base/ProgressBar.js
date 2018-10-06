import * as PIXI from 'pixi.js';
import config from '../../config';

import dragAndDrop from '../../../helpers/dragAndDrop';

import GuiableContainer from '../../../helpers/Guiable';
import Injector from '../../services/Injector';

import Deck from '../../assets/deck';

import Text from '../misc/Text';

import Machine from '../../game';

const ProgressFrameURL = '/files/assets/cards/frame_blue.png';
const ProgressFrame = PIXI.Texture.fromImage(ProgressFrameURL);

class ProgressBar extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            x,
            y,
            v
        } = props;

        // Properties Component 
        //this.imageURL = image || getParam('imageURL');
        this.position.set(x,y);

        this.options = {
            x: x || 0,
            y: y || 0,
            v: v || 0,
            t: 0
        };

        // GUI
        this.addFolder('ProgressBar');
        this.addToFolder('ProgressBar', this.options, 'v').onFinishChange((v) => this.setValue(v));
        this.addToFolder('ProgressBar', this.options, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('ProgressBar', this.options, 'y').onFinishChange((v) => this.position.y = v);
        this.addToFolder('ProgressBar', this.options, 't').onFinishChange((v) => this.setTimeout(v));
        //

        this.construct(props);
    }

    construct(props) {
        let {
            v
        } = props;

        let [w,h] = [200, 30];
        // Every card has a transparent region around so the hitArea is Reduced!!!
        let [hw,hh] = [config.CARD.WIDTH-config.CARD.OFFSET.X,config.CARD.HEIGHT-config.CARD.OFFSET.Y];  

        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0x6284D9  ,1);

        // set the line style to have a width of 5 and set the color to red
        this.sprite.pivot.set(this.w/2,this.h/2);
        this.sprite.drawRect(0, 0, w, h); // Center this shit 
        this.sprite.position.set(-w/2, -h/2);

        this.sprite.scale.set(v, 1);

        this.addChild(this.sprite);

        this.frame = new PIXI.Sprite(ProgressFrame);
        this.frame.anchor.set(0.5,0.5);
        this.frame.width = w+40;
        this.frame.height= h+5;

        this.addChild(this.frame);
    }

    setValue(v) {
        this.sprite.scale.set(v, 1);
    }

    _intervalCallback(dt, fn) {
        this.setValue(1 - (this._ctime/this._total));
        this._ctime += dt;
        console.log('Interval +');
        if(this._ctime > this._total) {
            console.log('Interval stop');
            clearInterval(this._interval);
            if(fn) fn();
        }
    }

    setTimeout(v, fn) {
        if(this._interval) clearInterval(this._interval);
        this._total = v;
        this._ctime = 0;
        this._interval = setInterval(this._intervalCallback.bind(this), 50, 50, fn);
        console.log('Interval set');
    }


    setTexture(texture) {
        this.sprite.texture = texture;
    }


    // Animate to Position
    moveTo(point, milliseconds=1000) {
        if(typeof point === "undefined") {
            return; // Some times this happens...
        }
        let path = new PIXI.tween.TweenPath();
        path.moveTo(this.position.x, this.position.y).lineTo(point.x, point.y);

        this._tween = PIXI.tweenManager.createTween(this);
        this._tween.easing = PIXI.tween.Easing.outQuart();
        this._tween.loop = false;
        this._tween.path = path;
        this._tween.time = milliseconds;
        this._tween.start();
        return this;
    }
    // Animate Scale
    scaleTo(newscale, milliseconds=1000) {
        this._stween = PIXI.tweenManager.createTween(this);
        this._stween.easing = PIXI.tween.Easing.outQuart();
        this._stween.loop = false;
        this._stween.from({
            scale: { x: this.scale.x, y: this.scale.y }
        });
        this._stween.to({
            scale: { x: newscale, y: newscale }
        });
        this._stween.time = milliseconds;
        this._stween.start();
        return this;
    }

    destroy() {
        if(this._tween)
            this._tween.stop();
        if(this._stween)
            this._stween.stop();
        super.destroy();
    }

    _kill() {
        super._kill();
    }

    getAsJSON() {
        return {
            component: 'base/ProgressBar',
            x:  this.position.x,
            y:  this.position.y,
            v:  this.options.v
        };
    }
}

export default ProgressBar;