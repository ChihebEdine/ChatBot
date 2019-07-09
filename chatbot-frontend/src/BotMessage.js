import React, { Component } from 'react';
import './BotMessage.css';
import KeyWord from './KeyWord';
import ShowButton from './ShowButton';


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

    DisplayShowButton = () => {
        if(this.props.NeedButton){
            return <ShowButton parentid = {this.props.messageid} handleShowClick={this.props.handleShowClick}/>
        }

    }

    render() {
        return (
            <div className='bot-message-container' >
                <div className="BotMessage">
                    {this.props.content}
                </div>
                <div>
                    {this.state.keywords.map(keyword => {
                        this.keyCounter += 1;
                        return <KeyWord parentMessageId = {this.props.messageid} key={"kwb-" + this.keyCounter} updateKeyWords={this.props.updateKeyWords} removeKeyWord={this.removeKeyWord} word={keyword} CName="keyWordL" ShowCloseCross={false}/>;
                    })}
                </div>
                {this.DisplayShowButton()}
            </div>

        );
    }
}


export default BotMessage;