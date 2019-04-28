from channels.generic.websocket import WebsocketConsumer
import json

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user_message = text_data_json['message']

        # call the chatbot API here
        bot_message = "message recieved ! but i am not available ! your message was : " + user_message

        self.send(text_data=json.dumps({
            'message': bot_message
        }))