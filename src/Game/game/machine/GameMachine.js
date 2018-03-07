var Card = require('./Card.js');

class GameMachine {
	constructor() {
		this.state = {
			board: new Board(),
			players: [],
			hash: "0123456789"
		};

	}

	setState(state) {
		this.state = { ...this.state, ...state};
	}

	setBoard(board) {
		this.state = { ...this.state, board};
	}

	setPlayers(players) {
		this.state = { ...this.state, players};
	}

	runMove(move) {
		move.performMove(this.state.board);
	}
}

class Board {
	constructor() {
		this.data = [];
		this.owners = [];

		// These 2 to be updated after every move
		this.triggerPaths = []; // like attackVectors
		this.plusPaths = []; // like attackVectors
		for (var i=0; i < 9; i += 1) {
			this.triggerPaths[i] = [];
			this.plusPaths[i] = {
				winner: -1,
				sums: []
			}
		}
	}

	debug() {
		console.log('BOARD');
		console.log('---------------------------');
		console.log('Cards :');
		let s = '';
		for(var i=0,j=0;i<this.data.length;i+=1) {
			s += this.owners[i] + ':' + this.data[i] + '\t';
			j += 1;
			if(j%3===0)s += '\n';
		}
		console.log(s);
		console.log('---------------------------');
		console.log('Triggers');
		console.log('---------------------------');
		s = '';
		for(var i=0,j=0;i<this.triggerPaths.length;i+=1) {
			s += '[' + this.triggerPaths[i] + ']' + '\t\t';
			j += 1;
			if(j%3===0)s += '\n';
		}
		console.log(s);
		console.log('---------------------------');
		console.log('Pluspaths');
		console.log('---------------------------');
		s = '';
		for(var i=0,j=0;i<this.plusPaths.length;i+=1) {
			s += '[' + (this.plusPaths[i].winner) + ']' + '\t\t';
			j += 1;
			if(j%3===0)s += '\n';
		}
		console.log(s);
		console.log('---------------------------');

	}

	putCard(card, position, player) { // position = 0-9
		this.data[ position ] = card;
		this.owners[position] = player;

		this._calculatePlusAndTriggers(position);
		this._analyze(position);
	}

	_calculatePlusAndTriggers(position) {
		const attacker 		= this.data[position];
		for (let j = 0; j < 4; j += 1) {
			if ( Board.ATTACK_VECTORS[position][j] === 0 ) continue;
			
			const dx = this._getDisplacement(j);
			const attackedCard  = this.data[position + dx];
			const defendJ = ( j + 2 ) % 4;

			if (attackedCard) {
				const sum = attacker.attack[j] + attackedCard.attack[defendJ];
				this.plusPaths[	 	 position  ].sums[j] = sum;
				this.plusPaths[   position + dx].sums[defendJ] = sum;
				this.triggerPaths[	 position  ][j] =   attacker.attack[j] - attackedCard.attack[defendJ];
				this.triggerPaths[position + dx][defendJ] =   -this	.triggerPaths[position][j]; // opposite to the above
			}
		}
	}

	_getDisplacement(j) {
		switch(j) {
			case 0: return 1;//return {x: 1, y:0};
			case 1: return -3;//return {x: 0, y:1};
			case 2: return -1;//return {x: -1, y:0};
			case 3: return 3;//return {x: 0, y:-1};
			default: throw Error("Cannot _getDisplacement of this value: " + j);
		}
	}

	_flipCard(position, combo, owner) {
		// change owner!

		this.owners[position] = owner;
		if(combo) this._analyze(position, combo);
	}

	_analyze(position, combo) {
		// check rules!
		if(			this._checkSameRule(position) && !combo ) {
			// Apply Same Rule
			this._applySameRule(position);
		} else if ( this._checkPlusRule(position) && !combo ) {
			// Apply Plus Rule
			this._applyPlusRule(position);
		} else {
			this._applyAttackRule(position);
		}
	}

	_applyAttackRule(position) { //seems ok
		if ( !this.triggerPaths[position] ) return;
		for (let j = 0; j < 4; j += 1) {
			if ( Board.ATTACK_VECTORS[position][j] === 0 ) continue;
			const dx = this._getDisplacement(j);
			if ( this.triggerPaths[position][j] > 0 ) {
				this._flipCard(position + dx, false, this.owners[position]);
			}
		}
	}

	_applySameRule(position) {
		for (let j = 0; j < 4; j += 1) {
			if ( Board.ATTACK_VECTORS[position][j] === 0 ) continue;
			const dx = this._getDisplacement(j);
			if ( this.triggerPaths[position][j] === 0 ) {
				this._flipCard(position + dx, true, this.owners[position]);
			}
		}	
	}

	_applyPlusRule(position) {
		for (let j = 0; j < 4; j += 1) { // this for loop can be fixed seems obsolete & slow
			if ( Board.ATTACK_VECTORS[position][j] === 0 ) continue;
			const dx = this._getDisplacement(j);
			if ( this.plusPaths[position].sums[j] === this.plusPaths[position].winner ) {
				this._flipCard(position + dx, true, this.owners[position]);
			}
		}
	}

	_checkSameRule(position) {
		const card = this.data[position];
		let  sames = 0;
		for (let j = 0; j < 4; j += 1) {
			if ( Board.ATTACK_VECTORS[position][j] === 0 ) continue;			
			if (this.triggerPaths[position] && 
				this.triggerPaths[position][j] === 0) {
				sames += 1;
			}
		}	
		return sames > 1;
	}

	_checkPlusRule(position) { // refactor plz // need fix (problem double plus a.k.a. four side attack)
		const card = this.data[position];
		let pluses = {};
		let sum = -1;
		for (let j = 0; j < 4; j += 1) {
			if ( Board.ATTACK_VECTORS[position][j] === 0 ) continue;
			if(sum = this.plusPaths[position].sums[j])
				pluses[sum] = (pluses[sum] || 0) + 1;
		}
		for (var i in pluses) {
			if (pluses[i] > 1) {
				this.plusPaths[position].winner = parseInt(i);
				console.log(i);
				return true;
			}
		}
		this.plusPaths[position].winner = -1;
		return false;
	}

	isEmpty(position) {
		return !!this.data[position];
	}
}
// START From top left goin row row  
Board.ATTACK_VECTORS = [
//  [R, U, L, D] // right up left down
	[1, 0, 0, 1],
	[1, 0, 1, 1],
	[0, 0, 1, 1],
	[1, 1, 0, 1],
	[1, 1, 1, 1],
	[0, 1, 1, 1],
	[1, 1, 0, 0],
	[1, 1, 1, 0],
	[0, 1, 1, 0]
];

module.exports = {
	GameMachine
};