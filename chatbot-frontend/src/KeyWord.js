import React, { Component } from 'react';
import './KeyWord.css';


class KeyWord extends Component {

    handleClick = (e) => {
        let input = document.getElementById("Input");
        input.value += (" " + this.props.word);
    }

    render() {

        return <div onClick = {this.handleClick} className="keyWord">{this.props.word}</div>
    }
}


export default KeyWord;