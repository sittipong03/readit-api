import express from "express";
import * as paymentController from '../controllers/payment.controller.js';

const reviewRoute = express.Router();

reviewRoute.get("/payments/:orderId", paymentController.getPaymentInfo);
reviewRoute.post("/payment/:orderId", paymentController.createPayment);