import * as PIXI from 'pixi.js';
//import { getParam } from '../../../helpers/url';

import GuiableContainer from '../../../helpers/Guiable';
import EventManager from '../../services/EventManager';
import Injector from '../../services/Injector';

//const DefaultImageUrl = '/files/assets/ui/woodenbutton.png';
//const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

import config from '../../config.js';

class CardHolder extends GuiableContainer {
    constructor(props) {
        super(props);
        let {
            x,
            y,
            s
        } = props;

        // Properties Component 
        this.x = x || 0;
        this.y = y || 0;
        this.w = config.CARD.WIDTH-config.CARD.OFFSET.X;
        this.h = config.CARD.HEIGHT-config.CARD.OFFSET.Y;
        this.s = s || 1;
        // 236 283
        // GUI
        this.addFolder('CardHolder');
        this.addToFolder('CardHolder', this, 'x').onFinishChange((v) => this.change({x: v}));
        this.addToFolder('CardHolder', this, 'y').onFinishChange((v) => this.change({y: v}));
        this.addToFolder('CardHolder', this, 's').onFinishChange((v) => this.change({s: v}));
        //
        this.construct(props);
        this.appear();
        this.uncloak();
        // this.show(); 
        this.hide();
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
        this._placeFn = () => {
            // This is called before it is removed from the DragEnd Callback
            EventManager.trigger('CardPlaced', [this]); 
        };
        this.setEvents();

        this.position.set(this.x,this.y);

        this.scale.set(this.s);

        this.parentLayer = Injector.getByName('TopLayer');


        EventManager.on('CardDragging', this.show);
        EventManager.on('CardDraggingFinished', this.hide);
    }

    lockable() { this._lockable = true; return this;}

    show = () => { if(this._visible)this.addChild(this.sprite) }
    hide = () => { if(this._visible)this.removeChild(this.sprite) }

    disappear = () => { this.hide(); this._visible = false; }
    appear = () => { this._visible = true; this.show(); }

    cloak = () => { this.sprite.alpha = 0.01; }
    uncloak = () => { this.sprite.alpha = 1.0; }

    getCard() {
        return this._card;
    }
    
    isEmpty() {
        return this._card === null || this._card === undefined;
    }

    setEvents() {
        this.sprite.on('mouseup', this._placeFn);
        this.sprite.on('touchend',this._placeFn);
    }

    unsetEvents() {
        this.sprite.off('mouseup', this._placeFn);
        this.sprite.off('touchend',this._placeFn);
    }

    occupy(card) {
        this.lock(card);
        if(this._onDrop)
            this._onDrop(card);
    }

    lock(card = null) {
        this.unsetEvents();
        this._locked = true;
        if(card) {
            this._card = card;
            card.attach(this);
            if(this._lockable)card.unsetEvents();
        }
    }

    discard() {
        if(!this.isEmpty()) {
            if(this._card.parent)
                this._card.parent.removeChild(this._card);
            this._card.destroy();
        }
        if(this._locked)this.setEvents();
        this._locked = false;
    }

    unlock() {
        if(!this._lockable || !this._card) {
            this.setEvents();
            this._locked = false;
        }
    }

    scaleTo(s) {
        this.scale.set(s);
        this.s = s;
        return this;
    }

    change(props) {
        let newdata = {
            x: this.x,
            y: this.y,
            s: this.s,
            ...props
        };
        this.x = newdata.x;
        this.y = newdata.y;
        this.s = newdata.s;

        this.position.set(this.x,this.y);
        this.scale.set(this.s);
    }

    onDrop(fn) {
        this._onDrop = fn;
        return this;
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