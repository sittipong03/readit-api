import createError from "../utils/create-error.util.js";
import * as reviewService from "../services/review.service.js";

export async function testGet(req, res, next) {
  try {
    const data = await reviewService.testGetReview();
    res.json({ data, message: "Review" });
  } catch (error) {
    next(error);
  }
}

// create model
const createModerateModel = () => {
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0.1,
    maxOutputTokens: 1000,
  });
};
export const moderateReview = async (content) => {
  const model = createModerateModel();

  //create prompt template
  const prompt = ChatPromptTemplate.fromTemplate(
    `Hey, Gemini! You are a content moderator for a book review platform. Your job is to decide whether user-submitted reviews should be published or not.

Here's a review submission:
"${content}"

Publishing Guidelines:
- Reviews should be helpful to other readers
- Must be at least somewhat positive (we don't publish harsh negative reviews)
- Should have enough detail to be useful (not just "good book" or "bad book")
- Must be written respectfully without offensive language
- Should show the person actually read or engaged with the book
- Must not contain major spoilers without warnings
- Should include reasoning behind your rating
- Must be relevant to the book's content
- Cannot contain false information about the book
- Must disclose if you received the book for free

Scoring system (1-100):
- 80+ = Excellent, publish immediately
- 60-79 = Good enough, approve
- 40-59 = Borderline, usually reject
- Below 40 = Definitely reject

Decision: Only approve if score is 60 or higher.

Return your decision as JSON:
{{"isAccepted": boolean, "score": number, "reason": "brief explanation", "quality": "excellent/good/average/poor"}}`
  );

  // create parser
  const parser = new StringOutputParser();

  // create chain
  const chain = prompt.pipe(model).pipe(parser);

  try {
    // call chain
    const res = await chain.invoke({ content });

    console.log("Raw response:", res.content);

    // ทำความสะอาด response (เอา ```json และ ``` ออก)
    let cleanedContent = res.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent
        .replace(/```json\s*/, "")
        .replace(/\s*```$/, "");
    }

    console.log("Cleaned response:", cleanedContent);

    // แปลง JSON
    try {
      const jsonResult = JSON.parse(cleanedContent);
      console.log("Final result:", jsonResult);
      console.log(
        `Decision: ${jsonResult.isAccepted ? "APPROVED" : "REJECTED"}`
      );
      console.log(`Score: ${jsonResult.score}/100`);
      console.log(`Reason: ${jsonResult.reason}`);

      return jsonResult;
    } catch (parseError) {
      console.log("Could not parse JSON:", parseError.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

console.log(" Test 1: Short negative review ");
await moderateReview("fuck");

console.log(" Test 2: Good detailed review ");
await moderateReview(
  "This book was amazing! The character development was incredible and the plot kept me engaged throughout. I especially loved how the author handled the themes of friendship and betrayal. Highly recommend to anyone who enjoys fantasy novels. 5/5 stars!"
);

console.log(" Test 3: Harsh negative review ");
await moderateReview(
  "This book sucks! Complete waste of time. Author doesn't know how to write."
);
