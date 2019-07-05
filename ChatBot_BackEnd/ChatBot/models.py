from django.db import models

# Create your models here.

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    author = models.CharField(max_length=4)
    key_words = models.CharField(max_length=100)
    previous_message_id = models.IntegerField(null=True)
