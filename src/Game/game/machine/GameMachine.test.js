let GameMachine = require('./GameMachine').GameMachine;
let Moves = require('./GameMoves');
let Card = require('./Card');

var mac = new GameMachine();


let card = new Card();
card.setAttack([4,2,3,1]);
card.setOwner(666);


let ncard = new Card();
ncard.setAttack([4,3,3,10]);
ncard.setOwner(666);

let nncard = new Card();
nncard.setAttack([8,5,6,9]);
nncard.setOwner(665);

let move = new Moves.PlaceMove(card, 4, 666);
mac.runMove(move);

let nmove = new Moves.PlaceMove(card, 3, 665);
mac.runMove(nmove);

let nnmove = new Moves.PlaceMove(ncard, 1, 666);
mac.runMove(nnmove);


let nnnmove = new Moves.PlaceMove(nncard, 0, 665);
mac.runMove(nnnmove);


mac.state.board.debug();

