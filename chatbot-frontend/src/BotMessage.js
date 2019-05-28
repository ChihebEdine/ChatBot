import React, { Component } from 'react';
import './BotMessage.css';


class BotMessage extends Component {

    render() {
        return (
            <div className="BotMessage">{this.props.content}</div>
        );
    }
}


export default BotMessage;