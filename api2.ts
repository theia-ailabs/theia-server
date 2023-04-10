import request from "request";

async function getVoice() {
  const options = {
    url: "https://play.ht/api/v2/tts",
    headers: {
      Host: "play.ht",
      Authorization: "Bearer 89c8fc14d27c4cc3b891227b631ea7e6",
      "x-user-id": "ROGcxNsWDhMrCMff29DOatUjrGE3",
    },
    method: "POST",
    json: {
      quality: "medium",
      output_format: "mp3",
      speed: 1,
      sample_rate: 24000,
      text: "Hello, I'm Theia your AI assistant. How can I help you?",
      voice: "larry",
    },
  };

  request(options, function (error: any, response: any, body: any) {
    if (error) {
      console.error(error);
    } else {
      console.log(body);
    }
  });
}

getVoice();
