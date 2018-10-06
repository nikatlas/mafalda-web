var CryptoJS = require('crypto-js');

const SHA = CryptoJS.SHA256;

// var salt = CryptoJS.lib.WordArray.random(128 / 8).toString();

class Booster {
    constructor(user) {
        if(!user) throw Error('Booster must be owned by a user!');
        this.id = this.randomID();
        this.treasure = this.randomTreasure();
        this.user = user;
    }

    randomID() {
        return CryptoJS.lib.WordArray.random(128 / 8).toString();
    }

    randomTreasure() {
        return CryptoJS.lib.WordArray.random(256 / 8).toString();
    }
}
module.exports = Booster;