import React, { Component } from 'react';
import './ChatBot.css';
import MessageContainer from './MessageContainer';
import SelectionMenu from './SelectionMenu';
import KeyWord from './KeyWord';


class ChatBot extends Component {

  state = {
    messages: [
      {
        id: 0,
        author: 'bot',
        content: 'Welcome to Unchartech Searchbot! What type of company are you looking for?',
        keywords: [],
        need_button: false,
        company_table: []
      }
    ],
    selectedText: "",
    keywordsSelected: [],
    previous_message_id: null,
  };

  keyCounter = 0;
  ChatSocket = null;
  count = 1;

  resetBot = () => {
    console.log("reset exec")
    this.setState({
      messages: [
        {
          id: 0,
          author: 'bot',
          content: 'Welcome to Unchartech Searchbot! What type of company are you looking for?',
          keywords: [],
          need_button: false,
          company_table: []
        }
      ],
      selectedText: "",
      keywordsSelected: [],
      previous_message_id: null,
    })

    this.keyCounter = 0;
    this.ChatSocket = null;
    this.count = 1;
  }

  addMessage = (author, message, keywords, need_button, company_table) => {
    let NewMessage = {
      id: this.count,
      author: author,
      content: message,
      keywords: keywords,
      need_button: need_button,
      company_table: company_table
    }

    var Messages = this.state.messages;
    Messages.push(NewMessage);
    this.setState({ messages: Messages });
    this.count += 1;
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
      if (value === "") { value = "..." }
      this.addMessage("user", value, this.state.keywordsSelected.map(w => w.content), false, []);
      MC.scrollTop = MC.scrollHeight;

      let user_message = input.value;
      input.value = "";


      if (this.ChatSocket === null) {
        this.ChatSocket = new WebSocket('ws://127.0.0.1:8000/ws/chatbot/');

        this.ChatSocket.onerror = e => {
          e.preventDefault();
          this.addMessage("bot", "error : failed to connect to Django server, resetting ...", [], false, []);
          //this.setState({ keywordsSelected: [] })
          setTimeout( this.resetBot, 3000);
          MC.scrollTop = MC.scrollHeight;
          button.className = 'ready';
        }

        this.ChatSocket.onclose = e => {
          e.preventDefault();
          this.addMessage("bot", "error : the connection to Django server is lost, resetting ...", [], false, []);
          //this.setState({ keywordsSelected: [] })
          setTimeout( this.resetBot, 3000);
          MC.scrollTop = MC.scrollHeight;
          button.className = 'ready';
          //document.location.reload();

        }
      }

      if (this.ChatSocket.readyState === 1) {
        this.ChatSocket.send(JSON.stringify({
          'message': user_message,
          'keywordsSelected': this.state.keywordsSelected.map(s => s.content),
          'previous_message_id': this.state.previous_message_id,
          'button_pressed': false
        }));
        this.setState({ keywordsSelected: [] });
      }
      else if (this.ChatSocket.readyState === 0) {
        this.ChatSocket.onopen = e => {
          this.ChatSocket.send(JSON.stringify({
            'message': user_message,
            'keywordsSelected': this.state.keywordsSelected.map(s => s.content),
            'previous_message_id': this.state.previous_message_id,
            'button_pressed': false
          }));
          this.setState({ keywordsSelected: [] });
        };
      }

      else {
        this.addMessage("bot", "error : failed to connect to Django server, resetting ...", [], false, []);
        //this.setState({ keywordsSelected: [] })
        setTimeout( this.resetBot, 3000);
        MC.scrollTop = MC.scrollHeight;
        button.className = 'ready';
      }

      this.ChatSocket.onmessage = e => {
        button.className = 'ready';
        var data = JSON.parse(e.data);
        this.setState({ previous_message_id: data['bot_message_id'] })
        this.addMessage("bot", data['message'], data['keywords'], data['need_button'], data['company_table']);
        MC.scrollTop = MC.scrollHeight;
      }

    }
    else {
      button.className = 'ready';
    }
  }

  ShowResults = (id) => {

    if (this.count - 1 === id) {
      //button loading state
      var button = document.getElementById('SubmitButton');
      button.className = 'loading';

      //getting the user's message
      let MC = document.getElementById('MC');
      let input = document.getElementById('Input');
      input.value = "";

      this.addMessage("user", 'Show me what you have found', [], false, []);
      MC.scrollTop = MC.scrollHeight;

      this.ChatSocket.send(JSON.stringify({
        'message': '',
        'keywordsSelected': [],
        'previous_message_id': this.state.previous_message_id,
        'button_pressed': true
      }));

      this.ChatSocket.onmessage = e => {
        button.className = 'ready';
        var data = JSON.parse(e.data);
        this.setState({ previous_message_id: data['bot_message_id'] })
        // treat bot_message
        this.addMessage("bot", data['message'], data['keywords'], data['need_button'], data['company_table']);
        MC.scrollTop = MC.scrollHeight;
      }
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
    if (newKeyWords.findIndex(function (s) { return s.content === newWord }) === -1) {
      newKeyWords.push({ content: newWord, parentMessageId: parentMessageId });
      this.setState({ keywordsSelected: newKeyWords });
    }
  }

  removeKeyWord = (word, messageid) => {
    let list = this.state.keywordsSelected;
    let index = list.findIndex(function (element) { return (element.content === word && element.parentMessageId === messageid); });
    if (index > -1) {
      list.splice(index, 1);
    }
    this.setState({ keywordsSelected: list });
    this.state.messages[messageid].keywords.push(word);
  }


  render() {
    return (
      <div id="cbc" className="ChatBotContainer">
        <SelectionMenu selectedText={this.state.selectedText} />
        <div className="NameBox">Chat Bot</div>
        <MessageContainer updateKeyWords={this.updateKeyWords} messages={this.state.messages} handleShowClick={this.ShowResults} />
        <div className="QueryBox">
          <input id="Input" className="InputMessage" type="text" onKeyUp={this.handleKeys}
            placeholder="Search for keywords" autoComplete="off" ></input>
          <button onClick={this.handleClick} id="SubmitButton" type="submit" >Send</button>
        </div>
        <div className="keywords-selected">
          {this.state.keywordsSelected.map(keyword => {
            this.keyCounter += 1;
            return <KeyWord key={"kws-" + this.keyCounter} updateKeyWords={() => { }} removeKeyWord={this.removeKeyWord} word={keyword.content} parentMessageId={keyword.parentMessageId} CName="keyWordS" ShowCloseCross={true} />
          })}
        </div>
      </div>
    );
  }

}

export default ChatBot;
//onClick={this.handleClickOnBox}