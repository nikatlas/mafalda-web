import Net from './Net.js';


class UserService {

	constructor() {
	
	}

	login(username, password) {
		let data = {
			username,
			password
		};
		return Net.post('login', data)
				  .then((response) => {
				  	return this._setUser(response);
				  });
	}

	logout() {
		// To request Token removal
		this._unsetUser();
	}

	getUsername() {
		return this.username;
	}

	getToken() {
		return this.token;
	}

	_unsetUser() {
		// clear this singleton
	}
	
	_setUser(data) {
		if(!this._checkDataIntegrity(data)) {
			throw data;
		}

		let {
			username,
			token
		} = data;

		this.username = username;
		this.token = token;

		return data;
	}

	_checkDataIntegrity(data) {
		return true;
	}
}

export default new UserService();