import * as PIXI from 'pixi.js';
import config from '../../config';

import dragAndDrop from '../../../helpers/dragAndDrop';

import GuiableContainer from '../../../helpers/Guiable';
import Injector from '../../services/Injector';

import Deck from '../../assets/deck';

import Text from '../misc/Text';

import Machine from '../../game';

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
            x,
            y,
            id
        } = props;

        // Properties Component 
        //this.imageURL = image || getParam('imageURL');
        this.position.set(x,y);

        this.options = {
            x: x || 0,
            y: y || 0,
            team: false,
            id: id || 0
        };

        this.id = id;

        // GUI
        this.addFolder('Card');
        //this.addToFolder('Card', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('Card', this.options, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('Card', this.options, 'y').onFinishChange((v) => this.position.y = v);
        this.addToFolder('Card', this.options, 'team').onFinishChange((v) => this.setTeam(v));
        this.addToFolder('Card', this.options, 'id', 0, 1).onFinishChange((v) => this.loadCard(v));
        //

        this.construct(props);
    }

    construct(props) {
        let {
            id,
            team
        } = props;

        let [w,h] = [config.CARD.WIDTH,config.CARD.HEIGHT];
        // Every card has a transparent region around so the hitArea is Reduced!!!
        let [hw,hh] = [config.CARD.WIDTH-config.CARD.OFFSET.X,config.CARD.HEIGHT-config.CARD.OFFSET.Y];  

        this.sprite = new PIXI.Sprite();
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.width = w;
        this.sprite.height= h;

        this.frame = new PIXI.Sprite(RedImage);
        this.frame.anchor.set(0.5,0.5);
        this.frame.width = w;
        this.frame.height= h;
        //this.frame.setTexture(RedImage);

        let [lw,lh] = [412,137];
        this.label = new PIXI.Sprite(LabelImage);
        this.label.anchor.set(0.5,0.5);
        this.label.width = lw;
        this.label.height= lh;
        this.label.position.set(0,210);

        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(-hw/2,-hh/2,hw,hh);
        this.cursor = 'pointer';

        this.scale.set(0.355);

        this.addChild(this.sprite);
        this.addChild(this.label);
        this.addChild(this.frame);

        this.parentLayer = Injector.getByName('MainLayer');

        this.numbers = 
        [
            new Text({text: '1', x:  176, y: -17}),
            new Text({text: '1', y: -268}),
            new Text({text: '1', x: -176, y: -17}),
            new Text({text: '1', y:  268})
        ];
        this.numbers.forEach((item) => this.addChild(item));

        dragAndDrop(this);

        this.loadCard(id || 0);
        this.setTeam(team || 0);
    }

    setTeam(team) {
        switch(team) {
        case 0: case 'R': case 'r': case false:
            this.team = 0;
            this.frame.texture = RedImage;
            break;
        case 1: case 'B': case 'b': case true:
            this.team = 1;
            this.frame.texture = BlueImage;
            break;
        default: break;
        }
    }

    loadCard(number) {
        const mod = 4;
        number = parseInt(number+0.5, 10);
        this.card = number;
        this.imageURL = Deck.Filenames[number%mod];
        this.sprite.texture = Deck.Textures[number%mod];

        this.machineCard = new Machine.Card(number);
        this.machineCard.attack.forEach((a,i) => this.numbers[i].setText(a));
    }

    setTexture(texture) {
        this.sprite.texture = texture;
    }

    onClick(fn) {
        this.sprite.on('pointerdown', (e) => fn(e));
    }

    getHolder() {
        return this._holder;
    }

    attach(holder = null) { 
        this._holder = holder;
        setTimeout(() => {
            this.moveTo(this.parent.toLocal(holder.getGlobalPosition()));
        }, 10);
    }
    
    unsetEvents() {
        this.stopDND();
        return this;
    }

    lock() { return this.unsetEvents(); }
    unlock() { return this.setEvents(); }

    setEvents() {
        dragAndDrop(this);
        return this;
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
            component: 'base/Card',
            x:  this.position.x,
            y:  this.position.y,
            id: this.options.id,
            team: this.options.team
        };
    }
}

export default Card;