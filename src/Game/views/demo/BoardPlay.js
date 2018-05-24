import * as PIXI from 'pixi.js';

import Card from '../base/Card';
// import Injector from '../../services/Injector';
import BoardStage from './Board';

import * as Machine from '../../game';
console.log(Machine);
let GameMachine = new Machine.GameMachine();

class BoardPlayDemo extends PIXI.Container{
    constructor(props) {
        super();

        let {GameLayer} = props;
        this.GameLayer = GameLayer;

        this.stage = new BoardStage(props);
        this.addChild(this.stage);

        for(var i=0;i<5;i++) {
            let rn = parseInt((Math.random()*1000) % 6, 10);
            let card = new Card({GameLayer, id:rn});
            let t = i;
            this.stage.deck.getHolder(t).occupy(card);
            // setTimeout(() => ) , 100);
            this.addChild(card);
        }

        this.stage.board.onCardPlaced = (p,c) => this.moveOnMachine(p,c);

        document.onkeypress = (e) => {
            e = e || window.event;
            if (e.keyCode === '80') {
                if(this.freeSlots.includes(1))
                    this.NPCMove();
            }
        };

        this.freeSlots = [1,1,1, 1,1,1 ,1,1,1];
    }

    moveOnMachine(position, card) {
        // My move to machine
        let move = new Machine.GameMoves.PlaceMove(new Machine.Card(card.id), position, card.team);
        GameMachine.runMove(move);
        this.freeSlots[position] = 0;
        this.freeSlots.forEach((a,index) => {
            if(a === 1) return;
            this.stage.board.updateTeam(index, GameMachine.ownerOf(index));
        });

        // Play NPC
        if( card.team === 0 ) {
            if(this.freeSlots.includes(1))
                    this.NPCMove();
        }
    }

    NPCMove() {
        // Random NPC move to machine
        let cid = parseInt(Math.random() * 123456, 10) % 6;
        let pos;
        do{
            pos = parseInt(Math.random() * 12332145, 10) % 9; 
        } while (!this.stage.board.isEmpty(pos));

        let cc = new Card({GameLayer:this.GameLayer, id:cid, team: 1});
        this.addChild(cc);
        this.stage.board.holders[pos].occupy(cc);
    }

    _kill = () => {}

    getAsJSON = () => {return {component: 'demo/BoardPlay'}}
}

export default BoardPlayDemo;