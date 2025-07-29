import createError from "../utils/create-error.util.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as bookService from "../services/book.service.js";
import * as dotenv from "dotenv";
dotenv.config();

export async function testGet(req, res, next) {
  try {
    const data = await bookService.testGetBook();
    res.json({ data, message: "Book" });
  } catch (error) {
    next(error);
  }
}

// export async function createBook (req, res, next){
//     const {} = req.body
//     try {

//     } catch (error) {

//     }
// }

////////////////////////////////////////////////////////////////
// tag section : getTags  , createTags , updateTags , deleteTags
////////////////////////////////////////////////////////////////
export async function getTags(req, res, next) {
  try {
    const data = await bookService.getTags();
    res.json(data);
  } catch (error) {
    next(error);
  }
}
export async function createTag(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      createError(400, "Tag name is required");
    }
    const tagData = {
      data: {
        name,
        description,
      },
    };
    const newTag = await bookService.postTags(tagData);
    res.json(newTag);
  } catch (error) {
    next(error);
  }
}
export async function updateTag(req, res, next) {
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    const idExist = await bookService.getTagsById(id);
    if (!idExist) {
      createError(400, "Tag name not found");
    }

    if (!req.body) {
      createError(400, "Update data is required");
    }
    const tagData = {
      name,
      description,
    };
    const newTag = await bookService.patchTags(id, tagData);

    res.json(newTag);
  } catch (error) {
    next(error);
  }
}
export async function deleteTag(req, res, next) {
  try {
    const id = req.params.id;
    const idExist = await bookService.getTagsById(id);
    if (!idExist) {
      createError(400, "Tag name not found");
    }
    const newTag = await bookService.deleteTags(id);

    res.json(newTag);
  } catch (error) {
    next(error);
  }
}

const createFunFactModel = () => {
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0.1,
    maxOutputTokens: 1000,
  });
};

export const generateFunFacts = async (title, author) => {
  const model = createFunFactModel();

  const funFactPrompt = ChatPromptTemplate.fromTemplate(
    `Hey, Gemini ! Now you're the book expert. Generate quick fun facts about the book "{title}" by {author}.

Make it:
- Surprising and engaging
- Not too long
- Focus on one of these areas: writing inspiration, publication details, cultural impact, or author's experience


Return as simple JSON array:
{{
  "fact": "Your interesting fun fact here",
}}`
  );

  const parser = new StringOutputParser();
  const chain = funFactPrompt.pipe(model).pipe(parser);

  try {
    const res = await chain.invoke({ title, author });

    let cleanedContent = res.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent
        .replace(/```json\s*/, "")
        .replace(/\s*```$/, "");
    }

    return {
      success: true,
      data: JSON.parse(cleanedContent),
      type: "fun_fact",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      type: "fun_fact",
    };
  }
};
