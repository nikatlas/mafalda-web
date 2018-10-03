import * as PIXI from 'pixi.js';
// import config from '../../config';

import GuiableContainer from '../../../helpers/Guiable';
// import Deck from '../../assets/deck';
import CardHolder from '../base/CardHolder';
// import CollectionHolder from '../base/CollectionHolder';
import Injector from '../../services/Injector';
import UserService from '../../services/UserService';

import Text from '../misc/Text';
import Card from '../base/Card';

class BoardHandler extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            x,
            y
        } = props;

        // Properties Component 
        //this.imageURL = image || getParam('imageURL');
        this.position.set(x,y);

        this.options = {
            x: x || 0,
            y: y || 0,
        };

        // GUI
        this.addFolder('Board');
        //this.addToFolder('Board', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('Board', this.options, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('Board', this.options, 'y').onFinishChange((v) => this.position.y = v);
        
        this.construct(props);
    }

    construct(props) {
        let {
            GameLayer
        } = props;
        
        let BoardScale = 0.35;
        // Board BG
        let bg = new PIXI.Sprite(PIXI.Texture.fromImage('/files/assets/board_wood.jpg'));
        bg.parentLayer = Injector.getByName('BackgroundLayer');
        bg.position.set(-700,-500);
        bg.scale.set(1.75);
        this.addChild(bg);

        this.holders = [];
        this.holders.push(new CardHolder({GameLayer, 'x': -220, 'y': -230, team: 0, id: 4}).scaleTo(BoardScale).onDrop((c) => this.placeCard(0, c)));
        this.holders.push(new CardHolder({GameLayer, 'x': -50, 'y': -230, team: 1, id: 5}).scaleTo(BoardScale).onDrop((c) => this.placeCard(1, c)));
        this.holders.push(new CardHolder({GameLayer, 'x': 120, 'y': -230, team: 0, id: 1}).scaleTo(BoardScale).onDrop((c) => this.placeCard(2, c)));
        this.holders.push(new CardHolder({GameLayer, 'x': -220, 'y': 0, team: 1, id: 5}).scaleTo(BoardScale).onDrop((c) => this.placeCard(3, c)));
        this.holders.push(new CardHolder({GameLayer, 'x': -50, 'y': 0, team: 0, id: 2}).scaleTo(BoardScale).onDrop((c) => this.placeCard(4, c)));
        this.holders.push(new CardHolder({GameLayer, 'x': 120, 'y': 0, team: 1, id: 3}).scaleTo(BoardScale).onDrop((c) => this.placeCard(5, c)));
        this.holders.push(new CardHolder({GameLayer, 'x': -220, 'y': 230, team: 1, id: 4}).scaleTo(BoardScale).onDrop((c) => this.placeCard(6, c)));
        this.holders.push(new CardHolder({GameLayer, 'x': -50, 'y': 230, team: 1, id: 3}).scaleTo(BoardScale).onDrop((c) => this.placeCard(7, c)));
        this.holders.push(new CardHolder({GameLayer, 'x': 120, 'y': 230, team: 1, id: 3}).scaleTo(BoardScale).onDrop((c) => this.placeCard(8, c)));

        this.holders.forEach((item) => item.parentLayer = Injector.getByName('TopLayer'));
        this.holders.forEach((item) => item.lockable());
        this.holders.forEach((item) => this.addChild(item));

        this.score = new Text({GameLayer, x: 350, y: 0, text: '0 - 0'});
        this.addChild(this.score);
        
        // this.disable();

    }

    sync = (GameMachine) => {
        let board = GameMachine.state.board;
        const owners = board.owners;
        const data = board.data;
        console.log(owners);
        this.holders.forEach((holder, index) => {
            if ( data[index] && !holder.isEmpty() ) {
                holder.getCard().setTeam(GameMachine.getPositionTeam(index));
            } else if ( data[index] ) {
                const card = new Card({id: data[index].id});
                this.addChild(card);
                holder.occupy(card);
                card.setTeam(GameMachine.getPositionTeam(index));
            }
        });
        this.updateScore();
        GameMachine.flush();
        GameMachine.isMyTurn(UserService.getToken()) ? this.enable() : this.disable();
    }

    updateScore() {
        let score = this.holders.reduce((a,b) => {
            if(!b.isEmpty()){
                let card = b.getCard();
                a[card.team]++;
            }
            return a;
        }, ([0,0]) );
        this.score.setText(`${score[0]} - ${score[1]}`);

    }

    updateTeam(position, team) {
        if (!this.holders[position].isEmpty()) {   
            this.holders[position].getCard().setTeam(team);
        }
    }

    isEmpty(x) { return this.holders[x].isEmpty(); }

    getCard(x,y) {
        return this.holders[3*y+x].getCard();
    }

    disable() { 
        this.holders.forEach((item) => item.lock());
        this.disabled = true; 
    }
    enable() {
        this.holders.forEach((item) => item.unlock());
        this.disabled = false; 
    }

    placeCard(position, card) {
        if(this.onCardPlaced && !this.disabled) {
            this.onCardPlaced(position, card);
        }
    }

    clear() {
        this.holders.forEach((h) => {
            h.discard();
        })
    }

    onClick(fn) {
        this.sprite.on('pointerdown', (e) => fn(e));
    }

    _kill() {
        super._kill();
    }

    getAsJSON() {
        return {
            component: 'buildings/Board',
            x:  this.position.x,
            y:  this.position.y,
            id: this.options.id,
            team: this.options.team
        };
    }
}

export default BoardHandler;