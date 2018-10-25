// import Net from './Net.js';
import openSocket from 'socket.io-client';

import UserService from './UserService';

class SocketService {

    constructor(url) {
        // check persistence - reconnect 
        this.url = url === "localhost" ? "localhost:3555" : url; // add port to localhost
        this.sockets = {};
    }

    to(channel = '/') {
        if(channel[0] !== '/')channel = '/' + channel;
        return this.sockets[channel];
    }
    toGame() {
        return this.sockets[this.gameChannel];
    }
    openSocket(channel = '/') {
        if(channel[0] !== '/')channel = '/' + channel;
        let token = "token=" + UserService.getToken();
        this.sockets[channel] = openSocket('http://'+ this.url + channel, 
            { 
                query: token,
                path: '/sockets'
            });
        // this._applyPersistence();
    }
    setGame(channel = '/') {
        if(channel[0] !== '/')channel = '/' + channel;
        this.gameChannel = channel; 
    }

    getId() {
        return this.socket.id;
    }
    end(channel = '/') {
        // disconnect!
        this.sockets[channel].disconnect();
        return;
    }
}
export default new SocketService(window.location.hostname);