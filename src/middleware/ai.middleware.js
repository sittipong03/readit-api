import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as dotenv from "dotenv";

dotenv.config();
const googleAPIKey = process.env.GOOGLE_API_KEY;

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: googleAPIKey,
  maxOutputTokens: 2048,
});

export const searchBooks = async (userInfo) => {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant. Your task is to find a book based on the word provided by the user. Respond with a String separate by ',' of up to 5 book titles."],
      ["human", "{input}"]
    ]);

    const parser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke({
    input: userInfo
    });

    return result;
  } catch (error) {
    console.log(error)
  }
} 