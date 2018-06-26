import Net from './Net.js';


class UserService {

	constructor() {
		this.__enablePeristence = true;
	}

	login(username, password) {
		let data = {
			username,
			password
		};
		return Net.post('users/login', data)
				  .then((res) => res.json())
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
		this.username = null;
		this.token = null;
		this.__persistence();
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

		this.__persistence();
		return data;
	}

	__persistence() {
		if(!this.__enablePeristence)return;
		localStorage.setItem('user', JSON.stringify({
			username: this.username,
			token   : this.token
		}));
	}

	_checkDataIntegrity(data) {
		let tkn = data.token.length;
		let username = data.username.length;
		return tkn && username;
	}
}

export default new UserService();