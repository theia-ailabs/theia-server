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
      max_tokens: 1024,
    });
    const ans = completion.data.choices[0].text as string;
    console.log(ans);
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

// askChatGPT(
//   "Hola theia que tal estas? cuentame la relatividad de manera simplificada"
// );
