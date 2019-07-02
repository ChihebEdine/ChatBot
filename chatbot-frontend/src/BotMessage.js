import React, { Component } from 'react';
import './BotMessage.css';
import KeyWord from './KeyWord'


class BotMessage extends Component {

    state = {
        keywords: this.props.keywords
    }


    keyCounter = 0;

    removeKeyWord = (word) => {
        let list = this.state.keywords;
        let index = list.indexOf(word);
        if (index > -1) {
            list.splice(index, 1);
        }
        this.setState({ keywords : list });
    }

    render() {
        return (
            <div>
                <div className="BotMessage">
                    {this.props.content}
                </div>
                <div>
                    {this.state.keywords.map(keyword => {
                        this.keyCounter += 1;
                        return <KeyWord key={"kwb-" + this.keyCounter} updateKeyWords={this.props.updateKeyWords} removeKeyWord={this.removeKeyWord} word={keyword} CName="keyWordL" ShowCloseCross={false}/>;
                    })}
                </div>
            </div>

        );
    }
}


export default BotMessage;