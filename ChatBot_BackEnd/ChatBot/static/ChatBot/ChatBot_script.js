
document.querySelector('button').addEventListener('click', function clickHandler(e) {

    //Connection to the server
    var chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chatbot/');

    //button loading state
    e.preventDefault();
    var self = this;
    self.className = 'loading';


    //getting the user's message
    let MC = document.getElementById('MC');
    let input = document.getElementById('Input');
    let user_message = document.createElement('div');
    user_message.className = "User_Message";
    user_message.innerHTML = input.value;
    input.value = "";
    MC.appendChild(user_message);
    MC.scrollTop = MC.scrollHeight;

    //sending the user's message to server
    chatSocket.onopen = function(e){
        chatSocket.send(JSON.stringify({'message': user_message.innerHTML}));
    };
    
    //recieving a message from server
    chatSocket.onmessage = function (e) {
        self.className = 'ready';
        var data = JSON.parse(e.data);
        var server_message = data['message'];
        let bot_message = document.createElement('div');
        bot_message.className = "Bot_Message";
        bot_message.innerHTML = server_message;
        MC.appendChild(bot_message);
        MC.scrollTop = MC.scrollHeight;
    };
    

}, false);
