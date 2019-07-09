import React, { Component } from 'react';
import './MessageContainer.css';
import UserMessage from './UserMessage';
import BotMessage from './BotMessage';
import DateTime from './DateTime';


class MessageContainer extends Component {

    showMessage = (message) => {
        if (message.author === "user") {
            return (
                <div key = {"d" + message.id}>
                    <UserMessage key={message.id} content={message.content} keywords={message.keywords} ShowCloseCross={false}/>
                    <DateTime key={"t" + message.id} position="right"/>
                </div>);
        }
        else if(message.author === "bot") {
            return (
                <div key = {"d" + message.id}>
                    <BotMessage updateKeyWords={this.props.updateKeyWords} key={message.id} messageid ={message.id}  content={message.content} keywords={message.keywords} ShowCloseCross={false} NeedButton={message.need_button} handleShowClick={this.props.handleShowClick} />
                    <DateTime key={"t" + message.id} position="left"/>
                </div>);
        }
    }

    render() {
        return (
            <div id="MC" className="MessageContainer">
                {this.props.messages.map((message) =>
                    (this.showMessage(message)))}
            </div>
        );
    }
}


export default MessageContainer;