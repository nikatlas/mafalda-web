import * as PIXI from 'pixi.js';
import { getParam } from '../helpers/url.js';

class Loader extends PIXI.Container{

    constructor(GameLayer) {
        super();

        this.GameLayer = GameLayer;

        var comp = getParam('component');
        this.component = comp || '';


        let app = GameLayer.app;
        this.gui = GameLayer.gui();
        this.router = GameLayer.router();
        this.position.set(app.screen.width/2, app.screen.height/2);


        this.controller = this.gui.add(this, 'component');
        this.controller.onFinishChange((value) => this.loadComponent(value));

        if(this.component)
            this.loadComponent(this.component);
    }

    destroy() {
    	this.controller.remove();
    }

    loadComponent = (component) => {
    	if (this.instance) {
    		this.removeChild(this.instance);
    		this.instance._kill();
    	}
    	try {
    		if (component.length < 3) return;
    		let ctor = require('../Game/misc/' + component).default;
    		this.instance = new ctor({GameLayer: this.GameLayer, Router: this.router, Gui: this.gui});
    		this.addChild(this.instance);
    	} catch(e) {
    		throw e;
    	}
    }
}

export default Loader;