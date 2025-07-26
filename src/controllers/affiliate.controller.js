import createError from "../utils/create-error.util.js";
import * as affiliateService from "../services/affiliate.service.js";

export async function registerAffiliate(req, res, next) {
  try {
    // const userId = req.user.userId;
    const { userId, accountDetails, methodType } = req.body;

    if (!accountDetails || !methodType) {
      throw createError(400, "กรุณากรอกข้อมูลการรับเงินให้ครบถ้วน");
    }

    const affiliate = await affiliateService.registerAffiliate(
      userId,
      accountDetails,
      methodType
    );
    res.status(201).json({ message: "สมัครเป็น Affiliate สำเร็จ", affiliate });
  } catch (error) {
    next(error);
  }
}

export async function getSelf(req, res, next) {
  try {
    // const userId = req.user.userId;
    const { userId } = req.params;
    const affiliateInfo = await affiliateService.getAffiliate(userId);
    res.json({ affiliate: affiliateInfo });
  } catch (error) {
    next(error);
  }
}
