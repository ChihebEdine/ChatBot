import React, { Component } from 'react';
import './DateTime.css';


class DateTime extends Component {

    date = new Date();
    formatDate = () => {
        let h = this.date.getHours().toString();
        let m = this.date.getMinutes().toString();
        if(m.length === 1){
            m = "0"+ m;
        }
        return h + ":" + m;
    }

    render() {
        
        if (this.props.position === "left") {
            return (
                <div className="dateTimeLeft">{this.formatDate()}</div>
            );
        }
        else if (this.props.position === "right") {
            return (
                <div className="dateTimeRight">{this.formatDate()}</div>
            );
        }       
    }
}


export default DateTime;