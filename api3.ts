import axios from "axios";

const apiEndpoint = "https://play.ht/api/v2/tts";
const userId = "ROGcxNsWDhMrCMff29DOatUjrGE3";
const authToken = "89c8fc14d27c4cc3b891227b631ea7e6";

const generateTTS = async (text: string, voice: string, speed: number) => {
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "X-User-Id": userId,
    "Content-Type": "application/json",
  };

  const data = {
    text: text,
    voice: voice,
    speed: speed,
  };

  try {
    const response = await axios.post(apiEndpoint, data, { headers: headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

generateTTS(
  "Hello dear, I'm Téiá, your A I assistant. How can I help you?",
  "alphonso",
  1
);
