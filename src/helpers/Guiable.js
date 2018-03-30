import * as PIXI from 'pixi.js';

let Empty = {
    onFinishChange: () => this,
    listen: () => this

}
class GuiableContainer extends PIXI.Container { 
    constructor(props) {
        super();
        let {
            Gui
        } = props;

        this.Gui = Gui;
        if(Gui) {
            this.Gui = Gui;
            this.controllers = [];
            this.folders = {};
        }
    }

    addFolder = (name) => {
        if (!this.Gui) return Empty;
        this.folders[name] = this.Gui.addFolder(name);
    }

    addToFolder = (name, ...props) => {
        if (!this.Gui) return Empty;
        return this.folders[name].add(...props);
    }

    addGui = (...props) => {
        if (!this.Gui) return Empty;
        let cont = this.Gui.add(...props);
        this.controllers.push(cont);
        return cont;
    }

    _kill() {
        if (!this.Gui) return Empty;
        this.controllers.forEach((a) => a.remove());
        for(var k in this.folders) {
            this.Gui.removeFolder(k);
        }
    }
}

export default GuiableContainer;