import React, { Component } from 'react';
import './ShowButton.css';


class ShowButton extends Component {

    handleShowClick = (e) =>{ 
        this.props.handleShowClick(this.props.parentid)
    }
    

    render() {
        return <div onClick={this.handleShowClick} className='show-button'>Show the most relevant companies</div> ;
    }
}


export default ShowButton;