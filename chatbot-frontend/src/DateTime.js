import React, { Component } from 'react';
import './DateTime.css';


class DateTime extends Component {

    date = new Date();

    render() {
        
        if (this.props.position === "left") {
            return (
                <div className="dateTimeLeft">{this.date.getHours() + ":" + this.date.getMinutes() }</div>
            );
        }
        else if (this.props.position === "right") {
            return (
                <div className="dateTimeRight">{this.date.getHours() + ":" + this.date.getMinutes() }</div>
            );
        }       
    }
}


export default DateTime;