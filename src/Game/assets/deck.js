import * as PIXI from 'pixi.js';

let Deck = {
	Textures: [],
	Filenames: []
};
for(var i=0;i<6;i++) {
	let filename = '/files/assets/cards/sketches/' + i + '.png';
	Deck.Filenames.push(filename);
	Deck.Textures.push(PIXI.Texture.fromImage(filename));
}

export default Deck;