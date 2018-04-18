import * as PIXI from 'pixi.js';
import { getParam } from '../helpers/url.js';

class Loader extends PIXI.Container{

    constructor(GameLayer) {
        super();

        this.GameLayer = GameLayer;

        var comp = getParam('component');
        this.component = comp || '';


        let app = GameLayer.app;
        GameLayer.toggleGui();
        this.gui = GameLayer.gui();
        this.router = GameLayer.router();
        this.position.set(app.screen.width/2, app.screen.height/2);


        this.controller = this.gui.add(this, 'component').listen();
        this.controller.onFinishChange((value) => this.loadComponent({component: value}));

        this.gui.add(this, 'save');
        this.gui.add(this, 'load');
        this.gui.add(this, 'loadJSON');

        this.load();
    }

    destroy() {
    	this.controller.remove();
        this.GameLayer.toggleGui();
    }

    loadJSON = () => {
        var loadJSON = prompt("Enter load info...", "");
        
        let jsonData = null;
        try { 
            jsonData = JSON.parse(loadJSON);
        } catch (e) {
            alert("Error parsing input data!");
        }

        this.loadComponent(jsonData);
    }

    load = () => {
        let loadJSON = localStorage.getItem('SavedDevData');
        if(loadJSON) {
            loadJSON = JSON.parse(loadJSON);
            this.loadComponent(loadJSON);
        } else {
            if(this.component)
                this.loadComponent({component: this.component}); 
        } 
    }

    save = () => {
        let data = JSON.stringify(this.instance.getAsJSON());
        localStorage.setItem('SavedDevData', data);
        alert(data);
    }

    loadComponent = (params) => {
        let {
            component, 
            ...props
        } = params;
        this.component = component;
    	if (this.instance) {
    		this.removeChild(this.instance);
    		this.instance._kill();
    	}
    	try {
    		if (component.length < 3) return;
    		let ctor = require('../Game/views/' + component).default;
    		this.instance = new ctor({GameLayer: this.GameLayer, Router: this.router, Gui: this.gui, ...props});
    		this.addChild(this.instance);
    	} catch(e) {
    		throw e;
    	}
    }
}

export default Loader;