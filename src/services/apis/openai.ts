import axios from "axios";
import { v4 as uuidV4 } from "uuid";

class ChatGPTApi {
  accessToken: string | null;
  apiBaseUrl: string;
  backendApiBaseUrl: string;
  userAgent: string;

  constructor() {
    this.accessToken = null;
    this.apiBaseUrl = "https://chat.openai.com/api";
    this.backendApiBaseUrl = "https://chat.openai.com/backend-api";
    this.userAgent = USER_AGENT;
  }

  async getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = await getSession();
    }

    return this.accessToken;
  }

  async getConversation(message: string) {
    const accessToken = await this.getAccessToken();
    const body = {
      action: "next",
      messages: [
        {
          id: uuidV4(),
          role: "user",
          content: {
            content_type: "text",
            parts: [message],
          },
        },
      ],
      model: "text-davinci-002-render",
      parent_message_id: uuidV4(),
    };

    const res = await axios.post(
      `${this.backendApiBaseUrl}/conversation`,
      body,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "user-agent": this.userAgent,
        },
      }
    );
    return res.data;
  }
}

export const getSession = async () => {
  const res = (await axios.get("https://chat.openai.com/api/auth/session", {
    headers: {
      cookie: `__Secure-next-auth.session-token=${process.env.SESSION_TOKEN}`,
      "user-agent": USER_AGENT,
    },
  })) as any;

  if (res.status !== 200) {
    throw new Error("Unable to get session");
  }

  const accessToken = res?.data.accessToken;
  if (!accessToken) {
    throw new Error("Unable to get access token");
  }

  return accessToken;
};

export const USER_AGENT: string =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
