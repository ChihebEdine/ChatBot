from django.shortcuts import render

def ChatBot_ui(request):
    return render(request, 'ChatBot/ChatBot_view.html')
