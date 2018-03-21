import * as PIXI from 'pixi.js'
class Text extends PIXI.Container{
	constructor(props) {
		super();
		let {
			text,
			GameLayer,
			Gui
		} = props;

		this.text = text || '';
		if(Gui) {
			this.Gui = Gui.addFolder("Text");
			this.controller = this.Gui.add(this, 'text').onFinishChange((v) => this.setText(v));
		}

		this.textNode = new PIXI.Text(text,{fontFamily : 'Arial', fontSize: 28, fill : 0x000000, align : 'center'});
		this.textNode.anchor.set(0.5,0.5);
		this.addChild(this.textNode);
	}

	_kill() {
		this.Gui.remove(this.controller);
		this.destroy();
	}

	setText = (args) => this.textNode.setText(args);
}

export default Text;