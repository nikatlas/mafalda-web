import * as PIXI from 'pixi.js';
import GuiableContainer from '../../../helpers/Guiable';

const DefaultImageUrl = '/files/assets/ui/papyrus.jpg';
const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

class CardCollection extends GuiableContainer{
    constructor(props){
        super(props);
        let {
            image,
            x,
            y
        } = props;

        // Properties Component 
        this.imageURL = image || DefaultImageUrl;
        this.position.set(x,y);

        this.x = x || 0;
        this.y = y || 0;

          // GUI
        this.addFolder('CardCollection');
        this.addToFolder('CardCollection', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('CardCollection', this, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('CardCollection', this, 'y').onFinishChange((v) => this.position.y = v);
        //

        this.construct(props);
    }
    construct(props){
        let [w,h] = [800,600];

        this.sprite = new PIXI.Sprite(DefaultImage);
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.width = w;
        this.sprite.height= h;

        //Should be removed
        this.sprite.cursor = 'pointer';  
        //

        this.addChild(this.sprite);



    }

    loadImage(img) {
        this.imageURL = img;
        this.setTexture(PIXI.Texture.fromImage(img));
    }

    setTexture(texture) {
        this.sprite.texture = texture;
    }

    _kill() {
        super._kill();
    }

    getAsJSON() {
        return {
            component: 'base/CardCollection',
            image: this.imageURL,
            x: this.position.x,
            y: this.position.y
        };
    }

}

export default CardCollection;