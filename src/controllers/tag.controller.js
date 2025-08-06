import { getAllTags } from "../services/tag.service.js";

export async function handleGetAllTags(req, res, next) {
  try {
    const tags = await getAllTags();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
}