import * as PIXI from 'pixi.js';

class Loader extends PIXI.Container{

    constructor(GameLayer) {
        super();

        this.GameLayer = GameLayer;

        this.component = '';

        let app = GameLayer.app;
        this.gui = GameLayer.gui();
        this.router = GameLayer.router();
		this.position.set(app.screen.width/2, app.screen.height/2);


        this.controller = this.gui.add(this, 'component');
        this.controller.onFinishChange((value) => this.loadComponent(value));
    }

    destroy() {
    	this.controller.remove();
    }

    loadComponent = (component) => {
    	if(this.instance) {
    		this.removeChild(this.instance);
    		this.instance._kill();
    	}
    	try {
    		if(component.length < 3)return;
    		let ctor = require('../Game/misc/' + component).default;
    		this.instance = new ctor({GameLayer: this.GameLayer, Router: this.router, Gui: this.gui});
    		this.addChild(this.instance);
    	} catch(e) {
    		throw e;
    	}
    }
}

export default Loader;