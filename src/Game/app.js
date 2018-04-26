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

		this.viewStage = new PIXI.Container();
		// var graphics = new PIXI.Graphics();
		// graphics.beginFill(0xFFFF00,0.2);
		// // set the line style to have a width of 5 and set the color to red
		// graphics.lineStyle(5, 0xFF0000);
		// // draw a rectangle
		// graphics.drawRect(0, 0, 1280, 720);
		// this.app.stage.addChild(graphics);

		this.app.stage.addChild(this.viewStage);

		this._router = new Router(this.viewStage);
		
		this._gui = new DATGUI.default.GUI();
		DATGUI.default.GUI.toggleHide();
		// this._router.addRoute('Login', new Menu(this.app, 'LoginMenuConfig.js'));
		// this._router.addRoute('Test', new Menu(this.app, 'TestMenuConfig.js'));
		this.resize();
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
		let stageDimensions = [1280, 720];
		let ratio = 16/9;
    	var w,h,s,vw,vh,pw,ph;
	    
	    if (window.innerWidth / window.innerHeight >= ratio) {
	        w = parseInt(window.innerHeight * ratio, 10);
	        h = window.innerHeight;
	        s = window.innerHeight / stageDimensions[1];
	        vh = parseInt(h, 10);
	        vw = parseInt(vh * ratio, 10);
	        ph = parseInt(vh / 2, 10);
	        pw = parseInt((window.innerWidth)/2, 10);
	    } else {
	        w = window.innerWidth;
	        h = parseInt(window.innerWidth / ratio, 10);
	        s = window.innerWidth / stageDimensions[0];
	        vw = parseInt(w, 10);
	        vh = parseInt(vw / ratio, 10);
	        pw = parseInt(vw / 2, 10);
	        ph = parseInt((window.innerHeight)/2, 10);
	    }
	   	this.viewStage.position.set(640, 360);
	    this.app.stage.position.set(pw - vw/2, ph - vh/2);
	    this.app.stage.scale.set(s);
	    this.app.renderer.resize(window.innerWidth-1, window.innerHeight-1);
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
