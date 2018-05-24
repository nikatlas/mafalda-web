let GameMachine = require('./GameMachine').GameMachine;
let Moves = require('./GameMoves');
let Card = require('./Card');

var mac = new GameMachine();


let card = new Card(1);
let ncard = new Card(2);
let nncard = new Card(3);
//				R U L D
// card.setAttack([4,2,3,1]);
card.setOwner(666);

//				 R U L D
// ncard.setAttack([4,3,3,10]);
ncard.setOwner(666);

// nncard.setAttack([8,5,6,9]);
nncard.setOwner(665);


let move = new Moves.PlaceMove(card, 4, 666);

let nmove = new Moves.PlaceMove(card, 3, 665);

let nnmove = new Moves.PlaceMove(ncard, 1, 666);

let nnnmove = new Moves.PlaceMove(nncard, 0, 665);


mac.runMove(move);
mac.state.board.debug();
mac.runMove(nmove);
mac.state.board.debug();
mac.runMove(nnmove);
mac.state.board.debug();
mac.runMove(nnnmove);
mac.state.board.debug();

