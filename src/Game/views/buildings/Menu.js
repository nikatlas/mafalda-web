// import * as PIXI from 'pixi.js';
// import dragAndDrop from '../../../helpers/dragAndDrop';
import GuiableContainer from '../../../helpers/Guiable';
import Injector from '../../services/Injector';

import UserService from '../../services/UserService';

import Text from '../misc/Text';
import Button from '../misc/Button';

import SocketService from '../../services/SocketService';
import GameService from '../../services/GameService';

// const BlueURL = '/files/assets/cards/frame_blue.png';
// const BlueImage = PIXI.Texture.fromImage(BlueURL);

class Menu extends GuiableContainer{
    constructor(props) {
        super(props);
        let {
            x,
            y
        } = props;

        // Properties Component 
        //this.imageURL = image || getParam('imageURL');
        this.position.set(x,y);

        this.options = {
            x: x || 0,
            y: y || 0
        };


        // GUI
        this.addFolder('Menu');
        this.addToFolder('Menu', this.options, 'x').onFinishChange((v) => this.position.x = v);
        this.addToFolder('Menu', this.options, 'y').onFinishChange((v) => this.position.y = v);
        //
        this.construct(props);
    }

    construct(props) {
        let { GameLayer } = props;

        this.parentLayer = Injector.getByName('MainLayer');
        this.textSprite = new Text({text: "123", y: -345});
        this.textSprite.setText(UserService.getUsername() + ':' + UserService.getToken());

        let Online = new Text({GameLayer, width: 250});
        Online.position.set     (0, -300);
        Online.setText("Players Searching: ^.^");

        let Lobby = new Text({GameLayer, width: 250});
        Lobby.position.set     (0, -250);
        Lobby.setText("Players on Lobby: ^.^");

        this.addChild(Online);
        this.addChild(Lobby);

        SocketService.openSocket('');
        SocketService.on('queueSize', (size) => {
            Online.setText("Players Searching: " + size);
        });
        SocketService.on('lobbySize', (size) => {
            Lobby.setText("Players on Lobby: " + size);
        });

        let play = new Button({  y:-100 , Text: {text: "Play"}});
        play.onClick((e) => {
            SocketService.openSocket('randomFree');
            SocketService.on('test', () => {
                console.log("TESTING");
            });
            SocketService.on('queueSize', (size) => {
                Online.setText("Players Searching: " + size);
            });
            SocketService.on('lobbySize', (size) => {
                Lobby.setText("Players on Lobby: " + size);
            });
            SocketService.once('joinGame', (game) => {
                console.log('Joining Game...');
                console.log(game);
                Injector.getByName('Navigator').goToGame();
                GameService.init(game);
            });
        });

        let collection = new Button({  y:50 , Text: {text: "Collection"}});
        collection.onClick((e) => alert(e));
        let logout = new Button({  y:200 , Text: {text: "Logout"}});
        logout.onClick((e) => {
            let nav = Injector.getByName('Navigator');
            UserService.logout();
            nav.go('Login');
        });


        this.addChild(play);
        this.addChild(collection);
        this.addChild(logout);
        this.addChild(this.textSprite);
    }

    update = () => {
        this.textSprite.setText(UserService.getUsername() + ':' + UserService.getToken());
    }

    _kill() {
        super._kill();
    }

    getAsJSON() {
        return {
            component: 'buildings/Menu',
            x:  this.position.x,
            y:  this.position.y,
            id: this.options.id,
            team: this.options.team
        };
    }
}

export default Menu;