let BoostersRepository = require('../../database').Repositories.Boosters;
var Booster = require('./Booster');

class BoosterService {
	constructor() {
	}

	getUserBoosters(user) {
		return BoostersRepository.getBoostersByUser(user);
	}

	givePack(user) {
		let {id, ...boosterdata} = new Booster(user);
		return BoostersRepository.insert(id, boosterdata);
	}
}


let service = null; 
function getSingleton() { 
	return service = (service === null ? new BoosterService() : service);
}
module.exports = getSingleton();