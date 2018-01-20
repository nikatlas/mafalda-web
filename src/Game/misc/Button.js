import * as PIXI from 'pixi.js'
class Button extends PIXI.Sprite{
	constructor(text) {
		super(PIXI.Texture.fromImage('/files/assets/ui/woodenbutton.png'));
		this.text = text;
		
		this.anchor.set(0.5,0.5);

		this.interactive = true;
		this.buttonMode = true;

		this.textNode = new PIXI.Text(text,{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF, align : 'center'});
		this.textNode.anchor.set(0.5, 0.5);
		
		this.addChild(this.textNode);
	}

	onClick(fn) {
		this.on('pointerdown', (e) => fn(e));
	}
}

export default Button;