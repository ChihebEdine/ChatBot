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
        um = Message(author="user", key_words=str(keywords), previous_message_id=data['previous_message_id'])
        um.save()

        # call the chatbot API here
        bot_message = "message recieved ! but i am not available ! these are the key words you have entered/selected"
        bot_keywords = keywords
        # bot_message, bot_keywords = BOT(keywords)


        # saving bot message in the db
        bm = Message(author="bot", key_words=str(bot_keywords), previous_message_id=um.id)
        bm.save()
        
        return(bot_message, bot_keywords, bm.id)
        

    def receive(self, text_data):
        recieved_data_json = json.loads(text_data)
        bot_message, bot_keywords, bmid = self.AskChatBot(recieved_data_json)

        self.send(text_data=json.dumps({
            'message': bot_message,
            'keywords': bot_keywords,
            'bot_message_id' : bmid
        }))