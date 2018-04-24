import * as PIXI from 'pixi.js';
import GuiableContainer from '../../../helpers/Guiable';
import CardHolder from '../base/CardHolder';
//import Card from '../base/Card';

const DefaultImageUrl = '/files/assets/ui/papyrus.jpg';
const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

class CollectionDeck extends GuiableContainer{
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
        this.addFolder('CollectionDeck');
        this.addToFolder('CollectionDeck', this, 'imageURL').onFinishChange((v) => this.loadImage(v));
        this.addToFolder('CollectionDeck', this, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('CollectionDeck', this, 'y').onFinishChange((v) => this.position.y = v);
        //

        this.construct(props);
    }

    construct(props){
        let [w,h] = [200,600];

        this.sprite = new PIXI.Sprite(DefaultImage);
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.width = w;
        this.sprite.height= h;

        this.addChild(this.sprite);

        let cardHolder = new CardHolder({'x':0,'y':0,'w':60,'h':96});
        this.addChild(cardHolder);
        let cardHolder2 = new CardHolder({'x':0,'y':100,'w':60,'h':96});
        this.addChild(cardHolder2);
        let cardHolder3 = new CardHolder({'x':0,'y':0,'w':60,'h':96});
        this.addChild(cardHolder3);
        let cardHolder4 = new CardHolder({'x':0,'y':0,'w':60,'h':96});
        this.addChild(cardHolder4);
        let cardHolder5 = new CardHolder({'x':0,'y':0,'w':60,'h':96});
        this.addChild(cardHolder5);



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
            component: 'base/CollectionDeck',
            image: this.imageURL,
            x: this.position.x,
            y: this.position.y
        };
    }
}

export default CollectionDeck;