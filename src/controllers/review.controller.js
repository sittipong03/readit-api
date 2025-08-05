import createError from "../utils/create-error.util.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import prisma from "../config/prisma.config.js";
import * as dotenv from "dotenv";
import * as reviewService from "../services/review.service.js";
dotenv.config();

export async function createReview(req, res) {
  const { bookId } = req.params;
  const { title, content, reviewPoint } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;

  try {
    const review = await reviewService.createReviewService(
      userId,
      bookId,
      title,
      content,
      reviewPoint
    );

    return res.status(201).json({
      message: "Review added successfully",
      review: {
        id: review.id,
        bookId: review.bookId,
        title: review.title,
        content: review.content,
        reviewPoint: review.reviewPoint,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    if (error.message === "You have already submitted a review for this book.") {
      return res.status(409).json({ message: error.message });
    }

    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Failed to add review." });
  }
}

export async function getReviewsByBook(req, res) {
  const { bookId } = req.params;
  try {
    const reviews = await reviewService.getReviewsByBookService(bookId);
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      message: "Failed to fetch reviews.",
    });
  }
}

export async function editReview(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const updatedReview = await reviewService.editReviewService(id, userId, updateData);

    return res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    if (error.message === "Review not found.") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Unauthorized: You can only edit your own reviews.") {
      return res.status(403).json({ message: error.message });
    }

    console.error(`Error editing review ${id} by user ${userId}:`, error);

    return res.status(500).json({ message: "Failed to update review." });
  }
}

export async function deleteReview(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await reviewService.deleteReviewService(id, userId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Review not found.") {
      return res.status(404).json({
        message: error.message,
      });
    }
    if (
      error.message === "Unauthorized: You can only delete your own reviews."
    ) {
      return res.status(403).json({
        message: error.message,
      });
    }
    console.error("Error deleting review:", error);
    return res.status(500).json({
      message: "Failed to delete review.",
    });
  }
}

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

const getQualityFromScore = (score) => {
  if (score >= 85) return "EXCEPTIONAL";
  if (score >= 70) return "HIGH";
  if (score >= 60) return "GOOD";
  if (score >= 50) return "BORDERLINE";
  if (score >= 0) return "POOR";
  return "ERROR";
};

// save result to database
const saveResult = async (reviewId, result) => {
  try {
    await prisma.reviewModeration.create({
      data: {
        reviewId,
        score: result.score,
        reason: result.reason,
        quality: getQualityFromScore(result.score),
        feedback: result.feedback || null,
        isAccepted: result.isAccepted,
      },
    });
    return true;
  } catch (error) {
    console.error("Save failed:", error);
    return false;
  }
};

export const moderateReview = async (reviewId, content) => {
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
- 85+ = Exceptional !, approve with no edits
- 70-84 = High, approve with minor edits
- 60-69 = Good enough, still approve
- 50-59 = Borderline, usually reject
- Below 50 = Definitely reject

Decision: Only approve if score is 60 or higher.

Return your decision as JSON:
{{"isAccepted": boolean, "score": number 0-100, "reason": "brief explanation why", "feedback": "suggestions for improvement(if any)"}}`
  );

  // create parser
  const parser = new StringOutputParser();

  // create chain
  const chain = prompt.pipe(model).pipe(parser);

  try {
    // call chain
    const res = await chain.invoke({ content });

    console.log("Raw response:", res);

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
      console.log(`Feedback: ${jsonResult.feedback || "No feedback provided"}`);

      const saved = await saveResult(reviewId, jsonResult);

      return { ...jsonResult, reviewId, saved };
    } catch (parseError) {
      console.log("Could not parse JSON:", parseError.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export async function moderateReviewController(req, res) {
  const { reviewId, content } = req.body;

  try {
    // Validation
    if (!reviewId || !content) {
      return res.status(400).json({
        message: "reviewId and content are required",
      });
    }

    // เรียกใช้ AI moderation โดยตรง
    const result = await moderateReview(reviewId, content);

    if (!result) {
      return res.status(500).json({
        message: "Failed to moderate review",
      });
    }

    return res.status(200).json({
      message: "Review moderated successfully",
      result,
    });
  } catch (error) {
    console.error("Error moderating review:", error);
    return res.status(500).json({
      message: "Failed to moderate review",
    });
  }
}

// get moderation stats
export async function getStats(startDate, endDate) {
  try {
    const total = await prisma.reviewModeration.count({
      where: { moderatedAt: { gte: startDate, lte: endDate } },
    });

    const approved = await prisma.reviewModeration.count({
      where: {
        moderatedAt: { gte: startDate, lte: endDate },
        isAccepted: true,
      },
    });

    const avgScore = await prisma.reviewModeration.aggregate({
      where: { moderatedAt: { gte: startDate, lte: endDate } },
      _avg: { score: true },
    });

    return {
      totalReviews: total,
      approvedCount: approved,
      rejectedCount: total - approved,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      averageScore: Math.round(avgScore._avg.score || 0),
    };
  } catch (error) {
    console.error("Get stats failed:", error);
    return null;
  }
}

// close database connection
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
