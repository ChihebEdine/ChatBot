import React, { Component } from 'react';
import './UserMessage.css';


class UserMessage extends Component {

    render() {
        return (
            <div className="UserMessage">{this.props.content}</div>
        );
    }
}


export default UserMessage;