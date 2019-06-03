import React, { Component } from 'react';
import './ChatBot.css';
import MessageContainer from './MessageContainer';


class ChatBot extends Component {

  state = {
    messages: []
  };
  count = 0;
  path = 'ws://127.0.0.1:8000/ws/chatbot/'; //Django Path

  addMessage = (author, message) => {
    let NewMessage = {
      id : this.count,
      author: author,
      content: message,
    }

    var Messages = this.state.messages;
    Messages.push(NewMessage);
    this.setState({ messages: Messages });

    this.count +=1;
  }

  handleKeys = (e) => {
    // if Enter key
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleClick();
    }
  }


     
  handleClick = () => {

    //button loading state
    var button = document.getElementById('SubmitButton');
    button.className = 'loading';

    //getting the user's message
    let MC = document.getElementById('MC');
    let input = document.getElementById('Input');

    if (input.value !== "") {

      this.addMessage("user", input.value);
      MC.scrollTop = MC.scrollHeight;
      
      let user_message = input.value;
      input.value = "";
      
      let ChatSocket = new WebSocket(this.path);
      
      ChatSocket.onopen = e => {
        ChatSocket.send(JSON.stringify({'message': user_message}));
      };

      ChatSocket.onerror = e => {
        this.addMessage("bot", "Error : failed to connect to Django server");
        MC.scrollTop = MC.scrollHeight;
        button.className = 'ready';
      }

      ChatSocket.onmessage = e => {
        button.className = 'ready';
        var data = JSON.parse(e.data);
        this.addMessage("ChatBot", data['message']);
        MC.scrollTop = MC.scrollHeight;
      }
    }
    else{
      button.className = 'ready';
    }
  }


  render() {
    return (
      <div className="ChatBotContainer">
        <div className="NameBox">Chat Bot</div>
        <MessageContainer messages = {this.state.messages} />
        <div id = "id" className="QueryBox">
          <input id="Input" className="InputMessage" type="text"  onKeyUp = {this.handleKeys} 
          placeholder="Ask me ! ..." ></input>
          <button onClick={this.handleClick} id="SubmitButton" type="submit">Send</button>
        </div>
      </div>
    );
  }
}


export default ChatBot;
