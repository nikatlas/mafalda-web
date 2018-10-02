// import * as PIXI from 'pixi.js';

import Card from '../base/Card';
import Button from '../misc/Button';
// import Injector from '../../services/Injector';
import BoardStage from './Board';
import GuiableContainer from '../../../helpers/Guiable';

import * as Machine from '../../game';
console.log(Machine);
let GameMachine = new Machine.GameMachine();

const TURN_TIME = 1000;// ms delay for NPC 

class BoardPlayDemo extends GuiableContainer{
    constructor(props) {
        super(props);

        let {GameLayer} = props;
        this.GameLayer = GameLayer;

        this.stage = new BoardStage(props);
        this.addChild(this.stage);

        this.stage.deck.draw();

        this.stage.board.onCardPlaced = (p,c) => this.moveOnMachine(p,c);

        document.onkeypress = (e) => {
            e = e || window.event;
            if (e.keyCode === 80 || e.keyCode === 112) {
                if(this.freeSlots.includes(1))
                    this.NPCMove();
            }
            if (e.keyCode === 99) {
                this.stage.board.clear();
                this.freeSlots = [1,1,1, 1,1,1 ,1,1,1];
            }
            if (e.keyCode === 100) {
                this.stage.deck.draw();
            }
        };

        this.freeSlots = [1,1,1, 1,1,1 ,1,1,1];


        this.addUI(props);

        // Gui ///////////////////////////

        this.addFolder('BoardPlayDemo');
        this.addToFolder('BoardPlayDemo', this, 'saveState');
        this.addToFolder('BoardPlayDemo', this, 'loadState');
        /////////////////////////////////
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
            this.stage.deck.lock();
            if(this.freeSlots.includes(1))
                    setTimeout( () => this.NPCMove(), TURN_TIME);
        }

        this.stage.board.updateScore();
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

        this.stage.deck.unlock();
    }

    addUI(props) {
        let clearButton = new Button({GameLayer: this.GameLayer, Text: { text: 'Clear Board'}, x: 150, y: 200});
        clearButton.scale.set(0.6);
        this.addChild(clearButton.onClick(() => {
                this.stage.board.clear();
                this.freeSlots = [1,1,1, 1,1,1 ,1,1,1];
        }));
        let drawButton = new Button({GameLayer: this.GameLayer, Text: { text: 'Draw Cards'}, x: 150, y: 300});
        drawButton.scale.set(0.6);
        this.addChild(drawButton.onClick(() => {
                this.stage.deck.draw();
        }));
    }

    saveState = () => {
        let state = GameMachine.save();
        alert(JSON.stringify({ state: state, freeSlots: this.freeSlots}));
    }

    loadState = () => {
        var loadJSON = prompt("Enter load info...", "");
        
        let jsonData = null;
        try { 
            jsonData = JSON.parse(loadJSON);
        } catch (e) {
            alert("Error parsing input data!");
        }
        let {freeSlots, ...restState} = jsonData;
        this.freeSlots = freeSlots;
        GameMachine.load(restState);
        this.sync();
    }


    sync() {
        
    }

    _kill = () => {}

    getAsJSON = () => {return {component: 'demo/BoardPlay'}}
}

export default BoardPlayDemo;