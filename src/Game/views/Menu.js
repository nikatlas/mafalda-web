import * as PIXI from 'pixi.js';

const BUTTON_HEIGHT = 120;
class Menu extends PIXI.Container{
    constructor(app, config){
        super();
        this.stage = app.stage;
        this.buttons = require('./menuConfigs/'+config).default || [];
        this.calculatePositions();
        this.buttons.forEach((e) => this.addChild(e));
        this.test = 'dsa';
        this.position.set(app.screen.width/2, app.screen.height/2);
    }
    calculatePositions() {
        let length = this.buttons.length;
        let top = length * BUTTON_HEIGHT/2;
        this.buttons.forEach((b,i) => {
            b.position.set(0,-top + i*BUTTON_HEIGHT + BUTTON_HEIGHT/2);
        });
    }
}

export default Menu;