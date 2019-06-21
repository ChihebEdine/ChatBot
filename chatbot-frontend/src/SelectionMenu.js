import React, { Component } from 'react';
import './SelectionMenu.css';


class SelectionMenu extends Component {

    handleClickAsk = () => {
        let input = document.getElementById('Input');
        input.value += this.props.selectedText;
    }

    render() {
        return (
            <ul id='SM' className='Menu'>
                <li className='MenuItem' onClick={this.handleClickSearch}>Search</li>
                <li className='MenuItem' onClick={this.handleClickAsk}>Ask</li>
            </ul>
        );
    }
}


export default SelectionMenu;