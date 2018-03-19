import * as PIXI from 'pixi.js'
class Button extends PIXI.Sprite{
    constructor(props) {
        super(PIXI.Texture.fromImage('/files/assets/ui/woodenbutton.png'));
        
        let {
            text,
            Gui
        } = props;


        this.text = text || '';

        if(Gui) {
            this.Gui =  Gui;
            this.controller = Gui.add(this, 'text').onFinishChange((v) => this.textNode.setText(v));
        }
        
        this.anchor.set(0.5,0.5);
        this.interactive = true;
        this.buttonMode = true;
        this.textNode = new PIXI.Text(text,{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF, align : 'center'});
        this.textNode.anchor.set(0.5, 0.5);
        this.addChild(this.textNode);
    }


    _kill() {
        this.Gui.remove(this.controller);
        this.destroy();
    }

    onClick(fn) {
        this.on('pointerdown', (e) => fn(e));
    }
}

export default Button;