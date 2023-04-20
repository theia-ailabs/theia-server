import axios from "axios";
import { VOICE_API, VOICE_UID, VOICE_KEY } from "../../config";

export async function getSpeech(
  text: string,
  _voice = "abram",
  _speed = 1
): Promise<AudioBuffer> {
  const url = VOICE_API + "tts/stream";
  const options = {
    method: "POST",
    headers: {
      accept: "audio/mpeg",
      "content-type": "application/json",
      AUTHORIZATION: `Bearer ${VOICE_KEY}`,
      "X-USER-ID": VOICE_UID,
    },
    body: JSON.stringify({
      speed: _speed,
      sample_rate: 24000,
      text: text,
      voice: _voice,
    }),
  };
  const response = await axios.post(url, options.body, {
    headers: options.headers,
  });
  // console.log(response.data);
  return response.data;
}

export async function getSpeechUrl(
  text: string,
  _voice = "abram",
  _speed = 1
): Promise<string> {
  const url = VOICE_API + "tts";
  const options = {
    method: "POST",
    headers: {
      accept: "audio/mpeg",
      "content-type": "application/json",
      AUTHORIZATION: `Bearer ${VOICE_KEY}`,
      "X-USER-ID": VOICE_UID,
    },
    body: JSON.stringify({
      speed: _speed,
      sample_rate: 24000,
      text: text,
      voice: _voice,
    }),
  };
  const response = await axios.post(url, options.body, {
    headers: options.headers,
  });
  const data = response.data.split("data: ");
  const json = JSON.parse(data[data.length - 1]);
  return json.url.toString();
}

// getSpeechUrl(
//   "Hello, my name is Theia. I am a chatbot. I am here to help you. How can I help you?"
// );
