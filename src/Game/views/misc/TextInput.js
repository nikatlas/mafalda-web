import * as PixiTextInput from './PixiTextInput.js';
import GuiableContainer from '../../../helpers/Guiable';

import { TextStylesNames, TextStyles } from './Text';

class TextInput extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            text,
            style,
            width
        } = props;

        this.style = style || 'heavy';
        this.text = text || '';
        this.w = width || 120;

        this.addFolder('TextInput');
        this.addToFolder('TextInput', this, 'text').onFinishChange((v) => this.setText(v));
        this.addToFolder('TextInput', this, 'style', TextStylesNames).onFinishChange((v) => this.setStyle(v));

        this.construct(props); 
    }

    construct() {
        this.inputNode = new PixiTextInput(this.text,TextStyles[this.style]);
        this.inputNode.width = this.w || 320;
        this.inputNode.pivot.set(this.inputNode.width/2, this.inputNode.height/2);
        this.addChild(this.inputNode);
    }

    setText(text) {
        this.inputNode.text = text;
    }

    setStyle(style) {
        this.style = style;
        this.inputNode.style = TextStyles[style];
    }

    getValue() {
        return this.inputNode.text;
    }

    getAsJSON = () => {
        return {
            style: this.style,
            text: this.text,
            width: this.width,
            component: 'misc/TextInput'
        }
    }
}

export default TextInput;