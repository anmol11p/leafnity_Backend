import express from "express";
import {
  cancelOrder,
  createOrder,
  getAllOrderItem,
  getOrderItem,
  saveOrderInDb,
  verifyPayment,
} from "../controllers/orderController.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import { OrderSchema } from "../Schema/Zod.schema.js";
import { zodMiddleware } from "../Middleware/zod.middleware.js";
// import { verify } from "jsonwebtoken";
const orderRouter = express.Router();
orderRouter.post("/create", authMiddleware, createOrder);
orderRouter.route("/verify-payment").post(authMiddleware, verifyPayment);

// cancel the order
orderRouter.route("/cancel").post(authMiddleware, cancelOrder);
// save ordered items in db

orderRouter
  .route("/save")
  .post(authMiddleware, zodMiddleware(OrderSchema), saveOrderInDb);

// get all order from db
orderRouter.route("/getAllorder").get(authMiddleware, getAllOrderItem);

// get Single orderItem by orderItem id
orderRouter
  .route(`/getOrderItem/:orderItemId`)
  .get(authMiddleware, getOrderItem);

//? order ko cancel krna hai aur refund krna hai pese route banane hai status update krna hai
//! user ke saare order display krne hai with address ,plantifo,price ,quantity ke sath
export default orderRouter;
