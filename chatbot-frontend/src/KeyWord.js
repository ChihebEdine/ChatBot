import React, { Component } from 'react';
import './KeyWord.css';


class KeyWord extends Component {

    handleClick = (e) => {
        let input = document.getElementById("Input");
        this.props.updateKeyWords(this.props.word);
        input.value += (" " + this.props.word);
    }

    handleClose = (e) => {
        console.log(this.props.word);
    }

    render() {
        return (
            <div onClick={this.handleClick} className="keyWord">
                <div>{this.props.word} </div>
                <div onClick={this.handleClose} className="close"> </div>
            </div>
        )
    }
}


export default KeyWord;