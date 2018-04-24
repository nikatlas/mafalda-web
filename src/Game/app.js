import './app.css';
import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';

import Router from './Router.js';

let DATGUI = require('dat.gui');
// Polyfill removeFolder
DATGUI.default.GUI.prototype.removeFolder = function(name) {
  var folder = this.__folders[name];
  if (!folder) {
    return;
  }
  folder.close();
  this.__ul.removeChild(folder.domElement.parentNode);
  delete this.__folders[name];
  this.onResize();
}
////
class App {
	constructor(){
		this.__$$ = tweenManager;
		this.animateables = [];
		this.app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
		window.onresize = this.resize;
		this.app.view.style.display = 'none';
		document.body.appendChild(this.app.view);
		this.resize();

		this._router = new Router(this.app.stage);
		
		this._gui = new DATGUI.default.GUI();
		DATGUI.default.GUI.toggleHide();
		// this._router.addRoute('Login', new Menu(this.app, 'LoginMenuConfig.js'));
		// this._router.addRoute('Test', new Menu(this.app, 'TestMenuConfig.js'));
	}

	destroy() {
		this.app.view.style.display = 'none';
		this.animateables = [];
		this._router.clear();
	}

	init() {
		this.app.view.style.display = 'block';
		//this._router.go("Login");
	}

	router() {
		return this._router;	
	}

	gui() {
		return this._gui;
	}

	toggleGui() {
		DATGUI.default.GUI.toggleHide();
	}
	/////////
	resize = () => {
		let ratio = 16/9;
    	let w,h;
	    if (window.innerWidth / window.innerHeight >= ratio) {
	        w = window.innerHeight * ratio;
	        h = window.innerHeight;
	    } else {
	        w = window.innerWidth;
	        h = window.innerWidth / ratio;
	    }
	    
	    this.app.renderer.view.style.width = window.innerWidth + 'px';
	    this.app.renderer.view.style.height = window.innerHeight + 'px';
	    this.app.renderer.resize(window.innerWidth, window.innerHeight);
	    
	    this.app.stage.pivot.set(w/2,h/2);
	    this.app.stage.position.set(w/2,h/2);
	}

	step(dt) {
		for (let i=0; i < this.animateables.length; i+=1) {
			try{
				this.animateables[i].step(dt);
			} catch(e) {
				info("Problem running animateable : ");
				info(e);
				info(this.animateables[i]);
			}
		}
	}

	animate = (timestamp) => {
		var progress = timestamp - this._time;
		this._time = timestamp;
		this.step(progress);
		PIXI.tweenManager.update();
		if(this._running) window.requestAnimationFrame(this.animate);
	}

	stop() {
		this._running = false;
	}

	start() {
		var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
		this._time = timeStampInMs;
		this._running = true;
		console.log("Starting Request Animation Frame");
		window.requestAnimationFrame(this.animate);
	}

	add = (a) => {
		this.animateables.push(a);
	}
}

const info = (e) => console.log(e);
export default new App();
