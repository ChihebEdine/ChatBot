import React, { Component } from 'react';
import './ChatBot.css';
import MessageContainer from './MessageContainer';
import SelectionMenu from './SelectionMenu';
import KeyWord from './KeyWord';

//remarques : entrée utilisateur => mots cles 
// sortie Chatbot : mots cles + phrase 


class ChatBot extends Component {

  state = {
    messages: [],
    selectedText: "",
    path: 'ws://127.0.0.1:8000/ws/chatbot/',
    count: 0,
    keywordsSelected: [],
  };

  keyCounter = 0;


  //keywordsSelected = [];

  addMessage = (author, message, keywords) => {
    let NewMessage = {
      id: this.state.count,
      author: author,
      content: message,
      keywords: keywords
    }

    var Messages = this.state.messages;
    Messages.push(NewMessage);
    this.setState({ messages: Messages });

    this.setState({ count: this.state.count + 1 });
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

    if (input.value !== "" || (this.state.keywordsSelected).length !== 0) {
      let value = input.value;
      if(value ===""){ value = "..."}
      this.addMessage("user", value, this.state.keywordsSelected.map(w => w.content));
      MC.scrollTop = MC.scrollHeight;

      let user_message = input.value;
      input.value = "";

      let ChatSocket = new WebSocket(this.state.path);

      ChatSocket.onopen = e => {
        ChatSocket.send(JSON.stringify({ 'message': user_message, 'keywordsSelected': this.state.keywordsSelected.map(s => s.content) }));
        this.setState({ keywordsSelected: [] });
      };

      ChatSocket.onerror = e => {
        this.addMessage("bot", "Error : failed to connect to Django server", []);
        MC.scrollTop = MC.scrollHeight;
        button.className = 'ready';
      }

      ChatSocket.onmessage = e => {
        button.className = 'ready';
        var data = JSON.parse(e.data);

        this.addMessage("bot", data['message'], data['keywords']);
        MC.scrollTop = MC.scrollHeight;
      }
    }
    else {
      button.className = 'ready';
    }
  }

  handleClickOnBox = (e) => {
    let cbc = document.getElementById('cbc');
    let sm = document.getElementById('SM');
    let s = window.getSelection();
    if (!s.isCollapsed) {
      let dy = e.clientY - cbc.offsetTop;
      let dx = e.clientX - cbc.offsetLeft;
      sm.style.top = dy + 'px';
      sm.style.left = dx + 'px';
      sm.style.transform = 'scale(1)';
      this.setState({ selectedText: " " + s.anchorNode.textContent.substring(s.extentOffset, s.anchorOffset) });
    }
    else {
      sm.style.transform = 'scale(0)';
    }
  }

  updateKeyWords = (newWord, parentMessageId) => {
    let newKeyWords = this.state.keywordsSelected;
    if ( newKeyWords.findIndex(function(s){return s.content === newWord}) === -1) {
      newKeyWords.push({content:newWord, parentMessageId:parentMessageId});
      this.setState({ keywordsSelected: newKeyWords });
    }
  }

  removeKeyWord = (word, messageid) => {
    let list = this.state.keywordsSelected;
    let index = list.findIndex(function(element){return(element.content===word && element.parentMessageId===messageid);});
    if (index > -1) {
      list.splice(index, 1);
    }
    this.setState({ keywordsSelected: list });
    this.state.messages[messageid].keywords.push(word);
  }

  render() {
    return (
      <div id="cbc" onClick={this.handleClickOnBox} className="ChatBotContainer">
        <SelectionMenu selectedText={this.state.selectedText} />
        <div className="NameBox">Chat Bot</div>
        <MessageContainer updateKeyWords={this.updateKeyWords} messages={this.state.messages} />
        <div className="QueryBox">
          <input id="Input" className="InputMessage" type="text" onKeyUp={this.handleKeys}
            placeholder="Search for keywords" autoComplete="off" ></input>
          <button onClick={this.handleClick} id="SubmitButton" type="submit">Send</button>
        </div>
        <div className="keywords-selected">
          {this.state.keywordsSelected.map(keyword => {
            this.keyCounter += 1;
            return <KeyWord key={"kws-" + this.keyCounter} updateKeyWords={() => {}} removeKeyWord={this.removeKeyWord} word={keyword.content} parentMessageId={keyword.parentMessageId} CName="keyWordS" ShowCloseCross={true} />
          })}
        </div>
      </div>
    );
  }

}

export default ChatBot;