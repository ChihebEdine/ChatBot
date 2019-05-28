import React from 'react';
import ReactDOM from 'react-dom';
import ChatBot from './ChatBot';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ChatBot />, div);
  ReactDOM.unmountComponentAtNode(div);
});
