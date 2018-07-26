import Net from './Net.js';


class UserService {

    constructor() {
        this.__enablePeristence = true;
        this.__load();
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
    
    __load() {
        if(!this.__enablePeristence)return;
        let user = localStorage.getItem('user');
        try { 
            let json = JSON.parse(user);
            this.username = json.username;
            this.token = json.token;
        } catch (e) {
            this._unsetUser();
            console.log(e);
        }
    }

    isLogged() {
        return this.username && this.username.length && this.token && this.token.length;
    }

    _checkDataIntegrity(data) {
        let tkn = data.token && data.token.length;
        let username = data.username && data.username.length;
        return tkn && username;
    }
}

export default new UserService();