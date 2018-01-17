import * as PIXI from 'pixi.js'
class Button extends PIXI.Sprite{
	constructor(text) {
		super(PIXI.Texture.fromImage('/files/assets/ui/woodenbutton.png'));
		this.text = text;
		
		this.anchor.set(0.5,0.5);

		this.interactive = true;
		this.buttonMode = true;
	}
}

export default Button;