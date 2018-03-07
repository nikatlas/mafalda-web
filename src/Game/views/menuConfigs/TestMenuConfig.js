import Button from '../../misc/Button.js'
import TextInput from '../../misc/TextInput.js'
import Text from '../../misc/Text.js'

const buttons = [];
buttons.push(new TextInput("Test input"));
buttons.push(new Text("Welcome to Test Menu!"));
let button = new Button("Test world");
buttons.push(new TextInput("Test test "));
button.onClick(() => alert("Test World! <3"));

buttons.push(button);

export default buttons;