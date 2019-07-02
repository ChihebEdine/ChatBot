import React, { Component } from 'react';
import './UserMessage.css';
import KeyWord from './KeyWord'


class UserMessage extends Component {

    keyCounter = 0;

    render() {
        return (
            <div>
                <div className="UserMessage">{this.props.content}</div>
                <div>
                    {this.props.keywords.map(keyword => {
                        this.keyCounter += 1;
                        return <KeyWord key={"kwu-" + this.keyCounter } updateKeyWords={() => {}} removeKeyWord ={() => { }} word={keyword} CName = "keyWordR" ShowCloseCross={false}/>;
                    })}
                </div>
            </div>
        );
    }
}


export default UserMessage;