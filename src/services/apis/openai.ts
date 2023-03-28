import axios from "axios";
import { v4 as uuidV4 } from "uuid";
import { USER_AGENT } from "../../constants";
import { OPENAI_KEY } from "../../config";

export class OpenaiApi {
  accessToken: string | null;
  apiBaseUrl: string;
  backendApiBaseUrl: string;
  userAgent: string;

  constructor() {
    this.accessToken = OPENAI_KEY;
    this.apiBaseUrl = "https://chat.openai.com/api";
    this.backendApiBaseUrl = "https://chat.openai.com/backend-api";
    this.userAgent = USER_AGENT;
  }

  async getSession() {
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
  }

  async getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = await this.getSession();
    }
    return this.accessToken;
  }

  async askChatGPT(message: string, engine = 3) {
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
      model: "text-davinci-00" + engine,
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
