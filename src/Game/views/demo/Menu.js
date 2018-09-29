import * as PIXI from 'pixi.js';
import Injector from '../../services/Injector';

import UserService from '../../services/UserService';

import TextInput from '../misc/TextInput';
import Text from '../misc/Text';
import Button from '../misc/Button';

class Menu extends PIXI.Container{
    constructor(props) {
        super();
        let {GameLayer, Gui} = props;

        let Play = new Text({GameLayer, width: 250});
        this.addChild(Play);
        
        let Market = new Text({GameLayer, width: 250});
        this.addChild(Market);

        let Collection = new Text({GameLayer, width: 250});
        this.addChild(Collection);

        let Logout = new Text({GameLayer, width: 200});
        this.addChild(Logout);

        // Set Properties
        Play.setText("Play Game");
        Market.setText("Market");
        Collection.setText("Collection");
        Logout.setText("Logout");

        // Position It
        Play.position.set	   (0, -150);
        Market.position.set	   (0, -100)
        Collection.position.set(0,-50);
        Logout.position.set    (0,0);

        Logout.onClick((e) => UserService.logout());
        
        Play.onClick(() => null);
        Market.onClick(() => null);
        Collection.onClick(() => null);
    }

    _kill = () => {

    }

    getAsJSON = () => {return {component: 'demo/Menu'}}
}

export default Menu;