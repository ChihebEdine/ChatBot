from django.db import models

# Create your models here.

class Message(models.Model):
    author = models.CharField(max_length=4)
    message = models.CharField(max_length=500)
    previous_message_id = models.IntegerField(null=True)

    def nextMessage(self):
        try :
            return Message.objects.get(previous_message_id=self.id)
        except:
            return None


    def GetPreConversation (self): 
        if self.previous_message_id == None :
            return self.author + " : " + self.message + '\n'
        else :
            preMessage = Message.objects.get(pk=self.previous_message_id)
            return preMessage.GetPreConversation() + self.author + " : " + self.message + '\n'

    def GetNextConversation(self):
        if self.nextMessage() == None:
            return ""
        else :
            return self.nextMessage().author + " : " + self.nextMessage().message + '\n' + self.nextMessage().GetNextConversation()

    def GetConversation(self):
        return self.GetPreConversation() + self.GetNextConversation()

    