import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatBot from './ChatBot';
import * as serviceWorker from './serviceWorker';



ReactDOM.render(<ChatBot />, document.getElementById('root'));

serviceWorker.unregister();
