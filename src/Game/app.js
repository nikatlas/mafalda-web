import './app.css'
import * as PIXI from 'pixi.js'

import Router from './Router.js'
import Menu from './views/Menu';


class App {
	constructor(){
		this.animateables = [];
		this.app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
		window.onresize = this.resize;
		this.app.view.style.display = 'none';
		document.body.appendChild(this.app.view);


		this._router = new Router(this.app.stage);
		this._router.addRoute('Login', new Menu(this.app, 'LoginMenuConfig.js'));
		this._router.addRoute('Test', new Menu(this.app, 'TestMenuConfig.js'));

	}
	destroy() {
		this.app.view.style.display = 'none';
		this.animateables = [];
	}
	init() {
		this.app.view.style.display = 'block';
		this._router.go("Login");
	}

	router() {
		return this._router;	
	}

	/////////
	resize = () => {
    	const w = window.innerWidth;
	    const h = window.innerHeight;
	    this.app.renderer.view.style.width = w + 'px';
	    this.app.renderer.view.style.height = h + 'px';
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
	add = (a) => {
		this.animateables.push(a);
	}
}

const info = (e) => console.log(e);

let singleton = null;
function getSingleton () {
	return singleton = (singleton === null ? new App() : singleton); 
}
export default getSingleton();
