import React, { Component } from 'react';
import './MessageContainer.css';
import UserMessage from './UserMessage';
import BotMessage from './BotMessage';


class MessageContainer extends Component {

    showMessage = (message) =>{
        if(message.author === "user"){
            return <UserMessage key = {message.id} content={message.content} />
        }
        else{
            return <BotMessage key = {message.id} content={message.content} />
        }
    }

    render() {
        return (
            <div id = "MC" className="MessageContainer">
                { this.props.messages.map((message) => 
                         (this.showMessage(message)))}  
            </div>
        );
    }
}


export default MessageContainer;