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

export const recommandBooks = async (bookName) => {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", 'Make your self as book suggestion , if people ask about the book , give them the others book name that relate to the book 5 samples do not give other string or opinion just only object format , book 1 | book 2 | book 3 | book 4 | book 5'],
      ["human", "{input}"]
    ]);

    const parser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(parser);

    return await chain.invoke({
      input: bookName
    });
  } catch (error) {
    console.log(error)
  }
}

export const doYouKnow = async(book) => {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", 'Make your self as book suggestion , if people ask about the book , give them the engaging questions to spark interest in the books among internet users, focusing on popular online topics or stories about writing, The result must be within 30 words and exclude the book title'],
      ["human", "{input}"]
    ]);
    const parser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(parser);
    return await chain.invoke({
      input: book
    });
  } catch (error) {
    console.log(error)
  }
}