import * as PIXI from 'pixi.js';

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
        if (!this.Gui) return;
        this.folders[name] = this.Gui.addFolder(name);
    }

    addToFolder = (name, ...props) => {
        if (!this.Gui) return;
        return this.folders[name].add(...props);
    }

    addGui = (...props) => {
        if (!this.Gui) return;
        let cont = this.Gui.add(...props);
        this.controllers.push(cont);
        return cont;
    }

    _kill() {
        if (!this.Gui) return;
        this.controllers.forEach((a) => a.remove());
        for(var k in this.folders) {
            this.Gui.removeFolder(k);
        }
    }
}

export default GuiableContainer;