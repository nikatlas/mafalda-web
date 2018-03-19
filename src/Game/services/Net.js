function checkIt(resp) {
    if ( Math.parseInt(resp.status / 100, 10) === 2) {
	    return resp;
	} else {
  		throw resp;
	}
}

function catchIt(err) {
	if ( Math.parseInt(err.status / 500, 10) === 5 ){
		return err;
	} else {
		throw err;
	}
}

class Net {
	constructor(baseURL) {
		this.baseURL = baseURL;
	}

	get(url) {
		url = this.baseURL + url;
		return fetch(url, {method: 'GET'}).then(checkIt).catch(catchIt);
	}

	post(url, body) {
		url = this.baseURL + url;
		return fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type':'application/json' 
			},
			body: 
		})
	}
}

module.exports = new Net();