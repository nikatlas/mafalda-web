import Button from '../misc/Button.js'
import * as PIXI from 'pixi.js'

const BUTTON_HEIGHT = 120;
class Menu extends PIXI.Container{
	constructor(app){
		super();
		this.stage = app.stage;
		this.buttons = this.createButtons();
		this.calculatePositions();
		this.buttons.forEach((e,i) => this.addChild(e));

		this.position.set(app.screen.width/2, app.screen.height/2);
		this.stage.addChild(this);
	}

	createButtons() {
		const buttons = [];
		
		let button = new Button("HI!");
		

		buttons.push(button);

		button = new Button("GJ");
		
		buttons.push(button);

		return buttons;
	}

	calculatePositions() {
		let length = this.buttons.length;
		let top = length * BUTTON_HEIGHT/2;
		this.buttons.forEach((b,i) => {
			b.position.set(0,top - i*BUTTON_HEIGHT - BUTTON_HEIGHT/2);
		});
	}
}

export default Menu;