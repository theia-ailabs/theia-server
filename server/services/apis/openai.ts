import { Configuration, OpenAIApi } from "openai";
import { OPENAI_KEY } from "../../config";

const configuration = new Configuration({
  apiKey: OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export async function askChatGPT(question: string): Promise<string | false> {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
    });
    const ans = completion.data.choices[0].text as string;
    return ans;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    return false;
  }
}

// askChatGPT("Hello, how are you?");
