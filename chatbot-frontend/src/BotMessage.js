import React, { Component } from 'react';
import './BotMessage.css';
import KeyWord from './KeyWord'


class BotMessage extends Component {

    counter = 0;

    showKeyWord = (keyword, id) => {
        return <KeyWord key={"kw-" + id } updateKeyWords={this.props.updateKeyWords}  word={keyword} />;
    }

    render() {
        return (
            <div>
                <div className="BotMessage">
                    {this.props.content}
                </div>
                <div>
                    {this.props.keywords.map(keyword => {
                        this.counter +=1;
                        return this.showKeyWord(keyword, this.counter);  
                    })}
                </div>
            </div>

        );
    }
}


export default BotMessage;