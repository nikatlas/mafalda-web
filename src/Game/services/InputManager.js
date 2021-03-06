

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.value = key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.value = key.isDown = true;
      key.isUp = false;

    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.value = key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

class InputManager {
	constructor(){
		this.actions = [];
		this.actionCallbacks = {};
		this.keys = {};
		this.initKeys();
		this.Action = Action;
		this.State = State;
		this._startCapturing();
	}

	_startCapturing() {
		// window.requestAnimationFrame()
		// start capturing 
		this.interval = setInterval(this._checkRules.bind(this), 100);
	}

	initKeys() {
		for (let i=0;i<512;i+=1) {
			this.keys[i] = keyboard(i);
		}

		this.keys['mouseX'] = 0;
		this.keys['mouseY'] = 0;

		window.addEventListener('mousemove', e => {
			this.keys['mouseX'] = (e.pageX ) / window.innerWidth;
        	this.keys['mouseY'] = (e.pageY ) / window.innerHeight;
    	});

    	window.addEventListener('mousedown', e => {
    		this.keys['mouse' + e.button] = true;
     	});

    	window.addEventListener('mouseup', e => {
    		this.keys['mouse' + e.button] = false;
     	});
	}

	_checkRules() {
		for (let i = 0; i < this.actions.length; i += 1) {
			let satisfaction = 0,
				action = this.actions[i],
				inputs = action.inputs;
			for (let j = 0; j < inputs.length; j+= 1) {
				satisfaction += this.keys[inputs[j].keyCode].value === inputs[j].desiredValue;
			}
			if (satisfaction === inputs.length) {
				this._invokeAction(action.name);
			}
		}
	}

	async _invokeAction (name, chainNum, data) { //strange stuff here :P 
		// invoke on Pipeline plz - Priority 
		let len = this.actionCallbacks[name].length;
		chainNum = !chainNum ? 0 : chainNum; 
		if (chainNum === len) {
			return;
		} else if (chainNum < len) {
			this.actionCallbacks[name][chainNum]  (   data, (res) => this._invokeAction(name, chainNum+1, res)  );
		}
	}


	createAction(action) {
		this.actions.push(action);
	}

	onAction(name, callback) {
		if(!this.actionCallbacks[name]) this.actionCallbacks[name] = [];
		this.actionCallbacks[name].push(callback);
	}

	offAction(action, callback) {
		if(!this.actionCallbacks[action])
			return;
		let index = this.actionCallbacks[action].indexOf(callback);
		if (index > -1) this.actionCallbacks.splice(index, 1);
	}

	onState(state, callback) {
		this.states.push({
			state,
			callback
		});
	}

	onRange(range, callback) {
		this.ranges.push({
			range,
			callback
		});
	}
}

class Action {
	constructor(name) {
		this.inputs = [];
		this.name = name;
	}

	addCondition(key, value) {
		if(typeof key === "string") key = key.toUpperCase().charCodeAt(0);
		console.log(key);
		this.inputs.push({
			keyCode: key,
			desiredValue: value 
		});
	}
}

class State {
	constructor() {
		this.inputs = [];
	}

	set(arrayOfInputs) {
		this.inputs = arrayOfInputs;
	}
}

export default new InputManager();