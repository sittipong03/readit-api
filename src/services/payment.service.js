import prisma from "../config/prisma.config";

export async function getPaymentInfo(orderId) {
  let payment = await prisma.payment.findMany({
    where : {orderId : orderId},
    orderBy : {paymentDate : "desc"}
  });
  return payment
}

export async function createPayment(amount, status, paymentMethod, orderId){
  
  let addPayment = await prisma.payment.create({
    data : {
      amount: amount,
      status: status,
      paymentMethod: paymentMethod,
      orderId: orderId
    }
  })
  return addPayment
}