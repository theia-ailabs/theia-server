import requests

url = "https://play.ht/api/v2/tts"

payload = {
    "quality": "medium",
    "output_format": "mp3",
    "speed": 1,
    "sample_rate": 24000,
    "text": "Hello, I'm Theia your AI assistant. How can I help you?",
    "voice": "larry"
}
headers = {
    "accept": "text/event-stream",
    "content-type": "application/json",
    "AUTHORIZATION": "Bearer 89c8fc14d27c4cc3b891227b631ea7e6",
    "X-USER-ID": "ROGcxNsWDhMrCMff29DOatUjrGE3"
}

response = requests.post(url, json=payload, headers=headers)

print(response.text)