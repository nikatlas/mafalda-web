// import Net from './Net.js';
import openSocket from 'socket.io-client';

import UserService from './UserService';

class SocketService {

    constructor(url) {
        // check persistence - reconnect 
        this.url = url === "localhost" ? "localhost:3555" : url; // add port to localhost
        this._persistence = [];
    }

    persistenceOn(name, fn) {
        this._persistence.push({name, fn});
        this._applyPersistence();
    }
    _applyPersistence() {
        this._persistence.map((item) => this.socket.on(item.name, item.fn));
    }
    openSocket(channel) {
        if(this.socket)
            this.socket.disconnect();
        this.socket = openSocket('http://'+ this.url +'/' + channel, 
            { 
                query: "token=" + UserService.getToken(),
                path: '/sockets'
            });
        this.on = this.socket.on.bind(this.socket);
        this.once = this.socket.once.bind(this.socket);
        this.emit = this.socket.emit.bind(this.socket);
        this.close = this.socket.close.bind(this.socket);

        this._applyPersistence();
    }

    getId() {
        return this.socket.id;
    }
}
export default new SocketService(window.location.hostname);