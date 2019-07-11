from channels.generic.websocket import WebsocketConsumer
from ChatBot.models import Message
import ChatBot.SearchBot.searchbot as css
import json



class ChatConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super()
        super().__init__(*args, **kwargs)
        self.bot =  None
        self.bot_action = 0
    


    def connect(self):
        self.accept()
        self.bot = css.Searchbot()
        

    def disconnect(self, close_code):
        del self.bot


    def AskChatBot(self, data):
        user_message = data['message']
        user_message = user_message.lower().strip().split(',')
        user_message = [ k.strip() for k in user_message]
        user_message = [ k for k in user_message if k!='' and k != ' ']
        
        selected_keywords = data['keywordsSelected']
        keywords = selected_keywords + user_message

        user_input = ''
        for k in keywords:
            user_input += (k + ',')

        # saving user message in the db
        um = Message(author="user", message=str(keywords), previous_message_id=data['previous_message_id'])
        um.save()

        # call the chatbot API here
        #bot_message = "message recieved ! but i am not available ! these are the key words you have entered/selected"
        #bot_keywords = keywords
        self.bot_action, bot_message, bot_keywords, need_button, company_table = self.bot.ACT(self.bot_action, user_input , button_pressed=bool(data['button_pressed']))
        bot_keywords = [ k.strip() for k in bot_keywords if k!='' and k != ' ']

        # saving bot message in the db
        bm = Message(author="bot", message=str(bot_keywords)+'---'+str(company_table), previous_message_id=um.id)
        bm.save()
        
        return(bot_message, bot_keywords, bm.id, need_button, company_table)
        

    def receive(self, text_data):
        recieved_data_json = json.loads(text_data)
        bot_message, bot_keywords, bmid, need_button, company_table = self.AskChatBot(recieved_data_json)

        self.send(text_data=json.dumps({
            'message': bot_message,
            'keywords': bot_keywords,
            'bot_message_id' : bmid,
            'need_button' : need_button,
            'company_table' : company_table
        }))
