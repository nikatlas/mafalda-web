var InputManager = require('./InputManager');

var Action = InputManager.Action;

let ad = new Action('testad');
ad.addCondition('a', true);
ad.addCondition('d', true);

let a = new Action('testa');
a.addCondition('a', true);
a.addCondition('d', true);

InputManager.onAction(ad, () => console.log('AD Action is here'));
InputManager.onAction(a, () => console.log('A Action is here'));
