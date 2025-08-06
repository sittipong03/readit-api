import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as dotenv from "dotenv";
import { getAllNameBook } from "../services/book.service.js";
import bookCache from "../cache/bookCache.js";
import { bookAllNameKey } from "../cache/cacheKeys.js";

dotenv.config();
const googleAPIKey = process.env.GOOGLE_API_KEY;

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: googleAPIKey,
  maxOutputTokens: 2048,
  cache: true
});



export const searchBooks = async (userInfo) => {
  let listBook = bookCache.get(bookAllNameKey);

  if(!listBook){
    listBook = await getAllNameBook()
    bookCache.set(bookAllNameKey, listBook)
  }

  // delete cachekey เวลามีการเปลี่ยนแปลง
  // bookCache.delete(bookAllNameKey)
  const titles = listBook.map(book => book.title);


  try {
    const prompt = ChatPromptTemplate.fromMessages([
      // ["system", "You are a helpful assistant. Your task is to find a book based on the word provided by the user. Respond with a String separate by ',' of up to 5 book titles."],
      ["system", `You are a specialized book-finding AI. Your only function is to receive a user's query and return a comma-separated string of relevant book titles from a predefined list.
      INSTRUCTIONS: Data Source: You will work exclusively with the following list of book titles: ${titles}. You must not suggest a book that is not on this list.
      User Input: The user will provide a query. This could be a title, theme, plot, character, or any related concept. Your Task: Analysis
      Analyze the user's query to understand its core meaning.
      Use your internal knowledge to find the most relevant book(s) from the ${titles} list based on theme, plot, and content, not just title keywords.
      MANDATORY Response Protocol & Output Format: Your response MUST be a single string containing only the full book titles.
      Separate each title with a single comma (,). Do not add spaces after the comma.
      Return a maximum of 5 of the most relevant titles.
      DO NOT include any introductory text (like "I found..."), explanations, numbering, bullet points, or any characters other than the book titles and the separating commas.
      Correct Output Example:
      The Picture of Dorian Gray,Faust,The Strange Case of Dr. Jekyll and Mr. Hyde
      Incorrect Output Examples:
      I found these books for you: The Picture of Dorian Gray, Faust
      1. The Picture of Dorian Gray, 2. Faust
      The Picture of Dorian Gray - This book is about...
      ['The Picture of Dorian Gray', 'Faust']
      If no match is found:  You MUST Return a maximum of 5 of the most relevant titles  that match in title that provide.`],
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