# Server views.py
from django.http import HttpResponse
from django.http import JsonResponse
from src.services.whisper_ai import theiaWhispers


def welcome(request):
    return HttpResponse("Hello, world! This is Theia Brain!")


async def theia(request):

    if request.method == 'POST':
        question = request.POST.get('question')
        answer = await theiaWhispers(question)
        response = {
            'status': 200,  # Success response
            'audio': answer.audio,
            'text': answer.text
        }
        return JsonResponse(response)
    else:
        response_error = {
            'status': 404,
            'error': 'Invalid request method',

        }
        return JsonResponse(response_error, status=400)
