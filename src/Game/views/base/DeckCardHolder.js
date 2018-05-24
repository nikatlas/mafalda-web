import * as PIXI from 'pixi.js';
//import { getParam } from '../../../helpers/url';

import CardHolder from './CardHolder';
import Card from './Card';
import EventManager from '../../services/EventManager';
import Injector from '../../services/Injector';

//const DefaultImageUrl = '/files/assets/ui/woodenbutton.png';
//const DefaultImage = PIXI.Texture.fromImage(DefaultImageUrl);

import config from '../../config.js';

class DeckCardHolder extends CardHolder {
    constructor(props) {
        super(props);
        let {

        } = props;

        // Properties Component 

        this.construct(props);

        this.appear();
        this.uncloak();
        this.show();
        
    }

    lock(card = null) {
        this.unsetEvents();
        this._locked = true;
        this._card = card;
        if(card) {
            card.attach(this);
            EventManager.trigger('CardAddedToDeck');
            //if(this._lockable)card.unsetEvents();
        }
    }

    unlock() {
        EventManager.trigger('CardRemovedFromDeck');
        this.setEvents();
        this._locked = false;
        this._card = null;
    }

}

export default DeckCardHolder;
