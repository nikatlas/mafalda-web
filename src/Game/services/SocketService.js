// import Net from './Net.js';
import openSocket from 'socket.io-client';

import UserService from './UserService';

class SocketService {

    // constructor() {
    //     // check persistence - reconnect 
    // }

    openSocket(channel) {
        if(this.socket)
            this.socket.disconnect();
        this.socket = openSocket('http://localhost:3555/' + channel, { query: "token=" + UserService.getToken() });
        this.on = this.socket.on.bind(this.socket);
        this.once = this.socket.once.bind(this.socket);
        this.emit = this.socket.emit.bind(this.socket);
        this.close = this.socket.close.bind(this.socket);
    }

    getId() {
        return this.socket.id;
    }


}

export default new SocketService();