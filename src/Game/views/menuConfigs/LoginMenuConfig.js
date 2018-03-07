import Button from '../../misc/Button.js'
import TextInput from '../../misc/TextInput.js'
import Text from '../../misc/Text.js'
import App from '../../app.js'


const buttons = [];
buttons.push(new Text("Welcome to Mafalda!"));
buttons.push(new TextInput("Username"));
buttons.push(new TextInput("Password"));
let button = new Button("Join world");
button.onClick(() => {
	console.log(App);
	App.router().go("Test");
});

buttons.push(button);

export default buttons;