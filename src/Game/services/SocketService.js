import Net from './Net.js';
import openSocket from 'socket.io-client';
class SocketService {

    constructor() {
        
    }
    openSocket(channel) {
        if(this.socket)
            this.socket.disconnect();
        this.socket = openSocket('http://localhost:3555/' + channel);
    }
}

export default new SocketService();