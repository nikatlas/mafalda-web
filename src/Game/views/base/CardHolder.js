import * as PIXI from 'pixi.js';
import { getParam } from '../../../helpers/url';

import GuiableContainer from '../../../helpers/Guiable';
import EventManager from '../../services/EventManager';

const DefaultImageUrl = '/files/assets/ui/woodenbutton.png';
const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

class CardHolder extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            x,
            y,
            w,
            h
        } = props;

        // Properties Component 
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 10;
        this.h = h || 10;

        // GUI
        this.addFolder('CardHolder');
        this.addToFolder('CardHolder', this, 'x').onFinishChange((v) => this.change({x: v}));
        this.addToFolder('CardHolder', this, 'y').onFinishChange((v) => this.change({y: v}));
        this.addToFolder('CardHolder', this, 'w').onFinishChange((v) => this.change({w: v}));
        this.addToFolder('CardHolder', this, 'h').onFinishChange((v) => this.change({h: v}));
        //
        this.construct(props);
    }

    construct() {
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xFFFF00,0.1);

        // set the line style to have a width of 5 and set the color to red
        this.sprite.lineStyle(3, 0xFF0000);
        this.sprite.pivot.set(this.w/2,this.h/2);
        this.sprite.drawRect(0, 0, this.w, this.h); // Center this shit 
        this.sprite.interactive = true;
        this.sprite.hitArea = new PIXI.Rectangle(0, 0, this.w, this.h);
        this.sprite.cursor = 'pointer';
        this.sprite.on('mouseup', () => {
            // This is called before it is removed from the DragEnd Callback
            EventManager.trigger('CardPlaced', [this.position, this._onDrop]); 
        });

        this.position.set(this.x,this.y);

        EventManager.on('CardDragging', () => this.addChild(this.sprite));
        EventManager.on('CardDraggingFinished', () => this.removeChild(this.sprite));
    }

    change(props) {
        let newdata = {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            ...props
        };
        this.x = newdata.x;
        this.y = newdata.y;
        this.w = newdata.w;
        this.h = newdata.h;

        this.position.set(this.x,this.y);
        this.sprite.width = this.w;
        this.sprite.height = this.h;
    }

    onDrop(fn) {
        this._onDrop = fn;
    }

    _kill() {
        super._kill();
    }

    getAsJSON() {
        return {
            component: 'base/CardHolder',
            x: this.position.x,
            y: this.position.y,
            w: this.sprite.width,
            h: this.sprite.height
        };
    }
}

export default CardHolder;