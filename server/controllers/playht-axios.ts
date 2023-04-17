import axios from "axios";

// Replace with your actual API Secret Key and User ID
const API_SECRET_KEY = "91590d8fdd3542dc9d6f6b625ee0cc9a";
const USER_ID = "ipBTiUkTfDbMiOGTXAupAeyezFS2";

// Set the API endpoint URL and version
const API_VERSION = "v2";
const API_BASE_URL = `https://play.ht/api${API_VERSION}/convert`;

// Set the request headers
const headers = {
  Authorization: `Bearer ${API_SECRET_KEY}`,
  "X-User-Id": USER_ID,
  "Content-Type": "application/json",
};

// Define the request payload
const payload = {
  text: "Hello, world! I'm Theia, your AI assistant. Please, tell me how can I help you, Javier?",
  voice: "Linda",
};

// Send the request to the API
axios
  .post(`${API_BASE_URL}/${API_VERSION}/tts`, payload, { headers })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
