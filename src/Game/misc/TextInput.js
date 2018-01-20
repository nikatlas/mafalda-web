import * as PIXI from 'pixi.js'
import * as PixiTextInput from './PixiTextInput.js'

class TextInput extends PIXI.Container{
	constructor(text, width) {
		super();
		this.inputNode = new PixiTextInput(text,{fontFamily : 'Arial', fontSize: 28, fill : 0x000000, align : 'center'});
		this.inputNode.width = width || 320;
		this.inputNode.pivot.set(this.inputNode.width/2, this.inputNode.height/2);
		this.addChild(this.inputNode);
	}

	value() {
		return this.value;
	}
}

export default TextInput;