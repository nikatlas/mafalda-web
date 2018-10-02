import Net from './Net.js';
import openSocket from 'socket.io-client';
class SocketService {

    constructor() {
        // check persistence - reconnect 
    }
    
    openSocket(channel) {
        if(this.socket)
            this.socket.disconnect();
        this.socket = openSocket('http://localhost:3555/' + channel);
        this.on = this.socket.on.bind(this.socket);
        this.once = this.socket.once.bind(this.socket);
        this.emit = this.socket.emit.bind(this.socket);
        this.close = this.socket.close.bind(this.socket);
    }


}

export default new SocketService();