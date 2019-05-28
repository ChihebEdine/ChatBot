import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatBot from './ChatBot';
import * as serviceWorker from './serviceWorker';
import BotMessage from './BotMessage';

ReactDOM.render(<ChatBot />, document.getElementById('root'));
///ReactDOM.render(<BotMessage content = 'hello' />, document.getElementById('id')); à regarder !!


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
