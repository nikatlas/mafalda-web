import * as PIXI from 'pixi.js'
class Text extends PIXI.Container{
	constructor(text) {
		super();
		this.textNode = new PIXI.Text(text,{fontFamily : 'Arial', fontSize: 28, fill : 0x000000, align : 'center'});
		this.textNode.anchor.set(0.5,0.5);
		this.addChild(this.textNode);
	}

	setText = (args) => this.textNode.setText(args);
}

export default Text;