import * as PIXI from 'pixi.js';
import Injector from '../../services/Injector';

import UserService from '../../services/UserService';

import TextInput from '../misc/TextInput';
import Text from '../misc/Text';
import Button from '../misc/Button';

class Login extends PIXI.Container{
    constructor(props) {
        super();
        let {GameLayer, Gui} = props;

        let email = new TextInput({GameLayer, width: 200});
        this.addChild(email);
        let password = new TextInput({GameLayer, width: 200});
        this.addChild(password);

        let emailText = new Text({GameLayer, width: 200});
        this.addChild(emailText);
        let passwordText = new Text({GameLayer, width: 200});
        this.addChild(passwordText);

        let loginBtn = new Button({GameLayer, width: 100});
        this.addChild(loginBtn);

        let registerBtn = new Button({GameLayer, width: 100});
        this.addChild(registerBtn);

        // Set Properties
        emailText.setText("Username/Email");
        passwordText.setText("Password");
        loginBtn.setText("Login");
        loginBtn.scaleTo(0.75);
        registerBtn.setText("Register");
        registerBtn.scaleTo(0.5);

        // Position It
        emailText.position.set	(0, -150);
        email.position.set		(0, -100)
        passwordText.position.set(0,-50);
        password.position.set 	(0,0);
        loginBtn.position.set	(0,	100);
        registerBtn.position.set(0,	220);

        // Events
        this.email = email;
        this.password = password;
        loginBtn.onClick((e) => this.login(e));
        registerBtn.onClick((e) => this.register(e));
    }

    login() {
		let e = this.email.getValue();
    	let p = this.password.getValue();

    	// UserService Singleton to be called
    	UserService.login(e,p)
    	.then((data) => {
            console.log(data);
            if(this._onLogin)
            	this._onLogin();
    		return true;
    	})
    	.catch((err) => {
    		console.log(err);
    		alert(JSON.stringify(err));
    		//throw err;
    	});
    }

    register() {
		let e = this.email.getValue();
    	let p = this.password.getValue();

    	// UserService Singleton to be called
    	UserService.register(e,p)
    	.then((data) => {
            console.log(data);
            this.login();
            return true;
    	})
    	.catch((err) => {
    		console.log(err);
    		alert(JSON.stringify(err));
    		//throw err;
    	});
    }

    onLogin = (fn) => {
    	this._onLogin = fn;
    }

    update = () => {
    	if(UserService.isLogged()) {
    		if( this._onLogin )
    			this._onLogin();
    	}
    }

    _kill = () => {

    }

    getAsJSON = () => {return {component: 'demo/Login'}}
}

export default Login;