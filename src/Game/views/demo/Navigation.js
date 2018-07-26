import * as PIXI from 'pixi.js';
import Injector from '../../services/Injector';

import UserService from '../../services/UserService';

import TextInput from '../misc/TextInput';
import Text from '../misc/Text';
import Button from '../misc/Button';

import Login from './Login';
import Menu from '../buildings/Menu';


class Navigation extends PIXI.Container{
    constructor(props) {
        super();
        let {GameLayer, Gui} = props;

        Injector.saveAs('Navigator',this);
        this.routes = {
            Login:   new Login({}),
            Menu:    new Menu({})
        }

        this.addChild(this.routes.Login);

        this.routes.Login.onLogin(() => this.go('Menu'));
        this.current = this.routes.Login;
        this.current.update();
    }

    go = (link) => {
        if(!this.routes[link])return;
        this.removeChild(this.current);
        this.addChild(this.routes[link]);
        this.current = this.routes[link];
        this.current.update();
    }

    _kill = () => {

    }

    getAsJSON = () => {return {component: 'demo/Navigation'}}
}

export default Navigation;