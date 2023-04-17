import axios from "axios";

const apiEndpoint = "https://play.ht/api/v2/tts";
const userId = "ROGcxNsWDhMrCMff29DOatUjrGE3";
const authToken = "89c8fc14d27c4cc3b891227b631ea7e6";

export const genSpeech = async (text: string, voice: string, speed: number) => {
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "X-User-Id": userId,
    "Content-Type": "application/json",
  };

  const params = {
    text: text,
    voice: voice,
    speed: speed,
  };

  try {
    const response = await axios.post(apiEndpoint, params, { headers: headers });
    const data = response.data.split('data: ');
    return JSON.parse(data[data.length - 1]);
  } catch (error) {
    console.error(error);
    return null;
  }
};