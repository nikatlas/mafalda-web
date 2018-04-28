class Injector {
    constructor(){
        this.components = {};
    }

    getByName(name) {
        return this.components[name];
    }
    
    saveAs(name, comp) {
        this.components[name] = comp;
    }
    load(json) {
        let  {
            component,
            children,
            name,
            ...rem
        } = json;

        if (this.components[name]) {
            this.getByName(name);
        }

        try {
            let ctor = require('../views/'+component).default;
            let comp = new ctor(rem);
            if (children) {
                for (let i=0;i < children.length;i += 1) {
                    comp.addChild(this.load(children[i]));
                }
            }
            this.components[name] = comp;
            return comp;
        } catch (e) {
            window.console.log('Injector[*]: Error loading JSON.');
            return;
        }
    }
}


export default new Injector();

