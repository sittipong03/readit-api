import createError from "../utils/create-error.util.js";
import * as paymentService from "../services/payment.service.js"

export async function getPaymentInfo(req, res, next) {
  try {
    const {orderId} = req.params;
    const payments = await paymentService.getPaymentInfo(orderId);
    if(!payments){
      createError(404, 'Cannot get the data')
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
}

export async function createPayment(req, res, next) {
  try {
    const {orderId} = req.params;
    const {amount, status, paymentMethod} = req.body
    const addPayment = await paymentService.createPayment(amount, status, paymentMethod, orderId);
    res.status(200).json({message: "Payment is success", payment: addPayment})
  } catch (error) {
    console.log(error)
  }
}