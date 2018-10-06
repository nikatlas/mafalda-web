import * as PIXI from 'pixi.js';
import GuiableContainer from '../../../helpers/Guiable';
import CardHolder from '../base/CardHolder';
import Injector from '../../services/Injector';

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
        let { GameLayer } = props;

        let [w,h] = [200,600];



        this.sprite = new PIXI.Sprite(DefaultImage);
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.width = w;
        this.sprite.height= h;

        this.sprite.parentLayer = Injector.getByName('BackgroundLayer');

        this.addChild(this.sprite);



        let cardHolder1 = new CardHolder({GameLayer,'x':0,'y':-240,'s':0.30});
        cardHolder1.parentLayer = Injector.getByName('MainLayer');
        this.addChild(cardHolder1);
        // let cardHolder2 = new CardHolder({GameLayer,'x':0,'y':-120,'s':0.30});
        // cardHolder2.parentLayer = Injector.getByName("TopLayer");
        // this.addChild(cardHolder2);
        let cardHolder3 = new CardHolder({GameLayer,'x':0,'y':0,'s':0.30});
        cardHolder3.parentLayer = Injector.getByName('TopLayer');
        this.addChild(cardHolder3);
        // let cardHolder4 = new CardHolder({GameLayer,'x':0,'y':120,'s':0.30});
        // cardHolder4.parentLayer = Injector.getByName("TopLayer");
        // this.addChild(cardHolder4);
        let cardHolder5 = new CardHolder({GameLayer,'x':0,'y':240,'s':0.30});
        cardHolder5.parentLayer = Injector.getByName('TopLayer');
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