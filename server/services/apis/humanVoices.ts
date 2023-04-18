import axios from "axios";
import { VOICE_API, VOICE_UID, VOICE_KEY } from "../../config";

export async function getSpeech(
  text: string,
  _voice = "abram",
  _speed = 1
): Promise<AudioBuffer> {
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
  const response = await axios.post(VOICE_API, options.body, {
    headers: options.headers,
  });
  // console.log(response.data);
  return response.data;
}
