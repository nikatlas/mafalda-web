import GuiableContainer from '../../helpers/Guiable';
import { getParam } from '../../helpers/url';
import drag from '../../helpers/draggable';

import Injector from '../services/Injector';


const BUTTON_HEIGHT = 120;
class Menu extends GuiableContainer{
    constructor(props){
        super(props);

        this.children = [];
        this.config = getParam('config') || '';

        this.addFolder('Menu');
        this.addToFolder('Menu', this, 'config').onFinishChange((v) => this.setConfig(v));

        if (this.config.length > 3) {
            this.setConfig(this.config);
        }

        this.setupHandlers();
    }

    setConfig(c) {
        if(!c)return;
        this.config = c;
        this.loadConfig(c);
    }

    loadConfig(config) {
        this._config = require('./configs/' + config).default || [];
        let {
            components
        } = this._config;

        for(let i=0; i < components.length; i+= 1) {
            this.children.push(Injector.load(components[i]));
        }

        this.children.forEach((c) => this.addChild(c));

    }

    addToMenu(elem) {
        this.elems.push(elem);
        this.calculatePositions();
    }

    calculatePositions() {
        let length = this.elems.length;
        let top = length * BUTTON_HEIGHT/2;
        this.elems.forEach((e,i) => {
            e.position.set(0,-top + i*BUTTON_HEIGHT + BUTTON_HEIGHT/2);
        });
    }


    setupHandlers() {
        let thebtn = Injector.getByName('TheBtn');
        //setInterval(() => thebtn.position.x = Math.sin(window.performance.now())*200, 10);
        thebtn.onClick(() => {
            //alert('HAHAHAH');
        });
        let thetxt = Injector.getByName('TheTxt');
        thetxt.setText('HAHAHAHHAHAHAHAH');
        drag(thebtn.sprite);
    }
}

export default Menu;