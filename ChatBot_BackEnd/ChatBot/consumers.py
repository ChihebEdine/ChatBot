from channels.generic.websocket import WebsocketConsumer
from ChatBot.models import Message
import json



class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def AskChatBot(self, data):
        user_message = data['message']
        user_message = user_message.strip().split(',')
        user_message = [ k.strip() for k in user_message]
        user_message = [ k for k in user_message if k!='' and k != ' ']
        
        selected_keywords = data['keywordsSelected']
        keywords = selected_keywords + user_message

        # saving user message in the db
        um = Message(author="user", key_words=str(keywords))
        um.save()

        # call the chatbot API here
        bot_message = "message recieved ! but i am not available ! these are the key words you have selected"
        bot_keywords = keywords

        # saving bot message in the db
        bm = Message(author="bot", key_words=str(bot_keywords))
        bm.save()

        return(bot_message, bot_keywords)
        

    def receive(self, text_data):
        recieved_data_json = json.loads(text_data)
        bot_message, bot_keywords = self.AskChatBot(recieved_data_json)

        self.send(text_data=json.dumps({
            'message': bot_message,
            'keywords': bot_keywords
        }))