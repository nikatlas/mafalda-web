import * as PIXI from 'pixi.js'
import GuiableContainer from '../../../helpers/Guiable'

class Text extends GuiableContainer {
	constructor(props) {
		super(props);
		let {
			text,
			style,
			x,
			y
		} = props;

		this.text = text || '';
		this.style = style || '';
		this.x = x || 0;
		this.y = y || 0;


		this.addFolder("Text");
		this.addToFolder('Text', this, 'text').onFinishChange((v) => this.setText(v));
		this.addToFolder('Text', this, 'style', TextStylesNames).onFinishChange((v) => this.setStyle(v));
		this.addToFolder('Text', this, 'x').onFinishChange((v) => this.position.x = v);
		this.addToFolder('Text', this, 'y').onFinishChange((v) => this.position.y = v);


		this.construct();
	}

	construct() {
		this.textNode = new PIXI.Text(this.text,TextStyles[this.style]);
		this.textNode.anchor.set(0.5,0.5);
		this.addChild(this.textNode);
	}

	setText = (args) => {
		this.text = args;
		this.textNode.text = args;
	}
	setStyle = (args) => {
		this.style = args;
		this.textNode.style = TextStyles[args];
	}

	getAsJSON = () => {
		return {
			component: 'misc/Text',
			text: this.text,
			style: this.style,
		}
	}
}

let TextStylesNames = {
	Normal: 'Normal',
	Light:  'Light',
	Heavy:  'Heavy',
	Comic:  'Comic',
	Info:   'Info'
};

let TextStyles = {
	Normal: new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 21, fill : 0x000000, align : 'center'}),
	Light:  new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 22, fill : 0x000000, align : 'center'}),
	Heavy:  new PIXI.TextStyle({fontFamily : 'Tahoma', fontSize: 25, fill : 0x022005, align : 'center'}),
	Comic:  new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 28, fill : 0x000000, align : 'Left'}),
	Info: 	new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 28, fill : 0x000000, align : 'center'})
};


export {
	TextStyles,
	TextStylesNames
};
export default Text;
