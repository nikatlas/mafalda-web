import './app.css'
import * as PIXI from 'pixi.js'


import Menu from './views/Menu';


class App {
	constructor(){
		this.animateables = [];
	}
	init() {
		this.app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb});
		window.onresize = this.resize;
		document.body.appendChild(this.app.view);

		this.add(new Menu(this.app));
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
				console.log("Problem running animateable : ");
				console.log(e);
				console.log(this.animateables[i]);
			}
		}
	}
	add = (a) => {
		this.animateables.push(a);
	}
}


let singleton = null;
function getSingleton () {
	return singleton = (singleton === null ? new App() : singleton); 
}
export default getSingleton();