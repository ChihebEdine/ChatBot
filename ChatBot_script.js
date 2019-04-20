
document.querySelector('button').addEventListener('click',function clickHandler(e){

    let MC = document.getElementById('MC');
    let Input = document.getElementById('Input');
    let User_message = document.createElement('div');
    User_message.className = "User_Message";
    User_message.innerHTML = Input.value;
    MC.appendChild(User_message);
    MC.scrollTop = MC.scrollHeight;
    Input.value = "";

    e.preventDefault();
    var self = this;
    setTimeout(function(){
        self.className = 'loading';
    },100);

    setTimeout(function(){
        self.className = 'ready';
        let Bot_message = document.createElement('div');
        Bot_message.className = "Bot_Message";
        Bot_message.innerHTML = "Sorry ! I am not available for the moment";  //Get the response of the API here ...
        MC.appendChild(Bot_message);
        MC.scrollTop = MC.scrollHeight;
    },1000);  // loading time ...
    

},false);
