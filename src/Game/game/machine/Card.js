class Card {
	constructor() {
		this.attack = [0,0,0,0];
		this.portrait = "";
		this.owner = "";
	}

	setAttack(attack) {
		this.attack = attack;
	}

	setOwner(owner) {
		this.owner = owner;
	}

}
module.exports = Card;