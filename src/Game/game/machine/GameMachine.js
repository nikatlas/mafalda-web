// var Card = require('./Card.js');
var SHA256 = require("crypto-js/sha256");
// TO-DO

// Need to create an initialization move or something to get verified!
// Players can have their names placed on state.players on init, showing turns and colors

class GameMachine {
    constructor() {
        this.state = {
            board: new Board(),
            players: [],
            hash: "0123456789",
            stack: []
        };
    }

    flush() {
        console.log(this.state);
    }

    setState(state) {
        this.state = { ...this.state, ...state};
    }

    setBoard(board) {
        this.state = { ...this.state, board};
    }

    save() {
        let temp = { ...this.state, board: this.state.board.save() };
        return temp;
    }

    load(state) {
        this.state.board.load(state.board);
        this.state = { ...state, board: this.state.board };
    }

    setPlayers(players) {
        this.state = { ...this.state, players};
    }

    getPlayerNumber(player) {
        return this.state.players[0] === player ? 0 : 1;
        // return this.state.players[0] === UserService.getUsername() ? 0 : 1;
    }

    getPositionTeam(x) {
        return this.state.players.indexOf(this.state.board.owners[x]);
    }

    hasFinished() {
        return this.state.stack.length >= 10;
    }

    getWinner() {
        const score1 = this.state.board.getScore(this.state.players[0]);
        const score2 = this.state.board.getScore(this.state.players[1]) + 1;
        return  score1 == score2 ? -1 
            : (
                score1 > score2
                    ? this.state.players[0]
                    : this.state.players[1]
            );
    }

    isMyTurn(player) {
        let moves = this.state.stack.length;
        return this.getPlayerNumber(player) === moves % 2 && moves < 10;
    }

    needFinalization() {
        return this.state.stack.length === 9;
    }

    runMove(move) {
        const spray = SHA256(JSON.stringify(move)).toString();
        if (this.state.stack.includes(spray)) {
            console.log('This move has been processed already');
            return;
        }
        try {
            move.verify(this.state);
            move.performMove(this.state.board);
            this.state.stack.push(spray);
        } catch (e) {
            throw e;
        }
    }

    ownerOf(x) {
        return this.state.board.owners[x];
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
                winners: [],
                sums: []
            };
        }
    }

    getScore(player) {
        return this.owners.reduce((a,b) => b === player ? a + 1 : a, 0);
    }

    debug() {
        console.log('BOARD');
        console.log('---------------------------');
        console.log('Cards :');
        let s = '';
        for(let i=0,j=0;i<9;i+=1) {
            s += `P${this.owners[i]}:${(this.data[i] ? this.data[i].attack.reduce((a,b) => a + b + "|", "|") : 'Empty')}\t`;
            j += 1;
            if(j%3===0)s += '\n';
        }
        console.log(s);
        console.log('---------------------------');
        console.log('Triggers');
        console.log('---------------------------');
        s = '';
        for(let i=0,j=0;i<9;i+=1) {
            s += `[${this.triggerPaths[i]}]\t\t`;
            j += 1;
            if(j%3===0)s += '\n';
        }
        console.log(s);
        console.log('---------------------------');
        console.log('Pluspaths');
        console.log('---------------------------');
        s = '';
        for(let i=0,j=0;i<9;i+=1) {
            s += `[${(this.plusPaths[i].winners.reduce((a,b) => a + b + '|', "|"))}]\t\t`;
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
        const attacker = this.data[position];
        for (let j = 0; j < 4; j += 1) {
            if ( Board.ATTACK_VECTORS[position][j] === 0 ) continue;
            
            const dx = this._getDisplacement(j);
            const attackedCard  = this.data[position + dx];
            const defendJ = ( j + 2 ) % 4;

            if (attackedCard) {
                const sum = attacker.attack[j] + attackedCard.attack[defendJ];
                this.plusPaths[      position  ].sums[j] = sum;
                this.plusPaths[   position + dx].sums[defendJ] = sum;
                this.triggerPaths[   position  ][j] =   attacker.attack[j] - attackedCard.attack[defendJ];
                this.triggerPaths[position + dx][defendJ] =   -this.triggerPaths[position][j]; // opposite to the above
            }
        }
    }

    _getDisplacement(j) {
        switch(j) {
        case 0: return 1;   //return {x: 1, y:0};
        case 1: return -3;  //return {x: 0, y:1};
        case 2: return -1;  //return {x: -1, y:0};
        case 3: return 3;   //return {x: 0, y:-1};
        default: throw Error ("Cannot _getDisplacement of this value: " + j);
        }
    }

    _flipCard(position, combo, owner) {
        // change owner!
        let isFlipping = owner !== this.owners[position];
        this.owners[position] = owner;
        if(combo && isFlipping) this._analyze(position, combo);
    }

    _analyze(position, combo) {
        // check rules!
        if(         this._checkSameRule(position) && !combo ) {
            // Apply Same Rule
            this._applySameRule(position);
        }
        if ( this._checkPlusRule(position) && !combo ) {
            // Apply Plus Rule
            this._applyPlusRule(position);
        } 
        this._applyAttackRule(position, combo);
    }

    _applyAttackRule(position, combo = false) { //seems ok
        if ( !this.triggerPaths[position] ) return;
        for (let j = 0; j < 4; j += 1) {
            if ( Board.ATTACK_VECTORS[position][j] === 0 ) continue;
            const dx = this._getDisplacement(j);
            if ( this.triggerPaths[position][j] > 0 ) {
                this._flipCard(position + dx, combo, this.owners[position]);
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
            if ( this.plusPaths[position].winners.includes(this.plusPaths[position].sums[j]) ) {
                this._flipCard(position + dx, true, this.owners[position]);
            }
        }
    }

    _checkSameRule(position) {
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
        let pluses = {};
        for (let j = 0; j < 4; j += 1) {
            if ( Board.ATTACK_VECTORS[position][j] === 0 ) continue;
            let sum = this.plusPaths[position].sums[j];
            if ( sum ) {
                pluses[sum] = (pluses[sum] || 0) + 1;
            }
        }
        for (var i in pluses) {
            if (pluses[i] > 1) {
                this.plusPaths[position].winners.push(parseInt(i, 10)); 
            }
        }
        return this.plusPaths[position].winners.length > 0;
    }

    isEmpty(position) {
        return !this.data[position];
    }

    save() {
        return {
            data: this.data,
            owners: this.owners
        }
    }
    load(state) {
        this.data = state.data;
        this.owners = state.owners;
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

module.exports = GameMachine;