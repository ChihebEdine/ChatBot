import React, { Component } from 'react';
import './KeyWord.css';


class KeyWord extends Component {

    handleClick = (e) => {
        this.props.updateKeyWords(this.props.word, this.props.parentMessageId);
        if(!this.props.ShowCloseCross){
            this.props.removeKeyWord(this.props.word);}
    }

    handleClose = (e) => {
        this.props.removeKeyWord(this.props.word,this.props.parentMessageId); 
    }

    CloseCross = () => {
        if(this.props.ShowCloseCross){
            return <div onClick={this.handleClose} className="close"> </div>;
        }
    }

    render() {
        return (
            <div onClick={this.handleClick} className={this.props.CName}>
                {this.CloseCross()}
                <div>{this.props.word}</div>
            </div>
        )
    }
}


export default KeyWord;