import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import $ from "jquery";
// import config from '../../config';

import UserService from '../../services/UserService';
import SocketService from '../../services/SocketService';

class ChatComponent extends Component {
    constructor(props) { 
        super(props);

        this.state = {
            messages: [],
            msg: ''
        };

        SocketService.persistenceOn('newChatMsg', (msg) => {
            console.log("New Chat Message!");
            this.setState({
                messages: [...this.state.messages, msg]
            });
        });
    }

    send(e) {
        SocketService.emit('chatMsg', {
            msg: this.state.msg,
            user: UserService.getUsername()
        });
        this.setState({
            msg: ''
        });
        e.preventDefault();
        return false;
    }

    toggle() {
        $('.chat').slideToggle(300, 'swing');
        $('.chat-message-counter').fadeToggle(300, 'swing');
    }
    
    render() {
        return (<div id="live-chat">
                    <header className="clearfix" onClick={() => this.toggle()}>
                        <span className="chat-close">x</span>
                        <h4>{UserService.getUsername()}</h4>
                        <span className="chat-message-counter">1</span>
                    </header>
                    <div className="chat">
                        <div className="chat-history">
                          {this.state.messages.map((item, index) => 
                            [<div className="chat-message clearfix"  key={2*index}>
                                <div className="letterbox">{item.user[0].toUpperCase()}</div>
                                <div className="chat-message-content clearfix">
                                    <span className="chat-time">{item.time}</span>
                                    <h5>{item.user}</h5>
                                    <p>{item.msg}</p>
                                </div> 
                            </div>, 
                            <hr  key={2*index+1} />]
                          )}
                        </div>
                        <form onSubmit={(e) => this.send(e)}>
                            <fieldset>
                                <input type="text" value={this.state.msg} placeholder="Type your message…" autoFocus onChange={(event) => this.setState({msg: event.target.value})}/>
                                <input type="hidden" />
                            </fieldset>
                        </form>
                    </div> 
                </div>);
    }
}

class ChatBox {
    mount() {
        var div = document.createElement("div");
        document.body.appendChild(div);
        ReactDOM.render(<ChatComponent />, div);
    }
}

export default ChatBox;