import express from "express";
import {
  addToCart,
  clearTheCart,
  deleteCartItemById,
  getCartInfo,
} from "../controllers/cartController.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
const cartRouter = express.Router();

cartRouter.route("/add").post(authMiddleware, addToCart);
cartRouter.route("/getCartInfo").get(authMiddleware, getCartInfo);
cartRouter

  .route("/deleteCartItemByplantId/:plantId")
  .delete(authMiddleware, deleteCartItemById);
cartRouter.route("/clearCart").delete(authMiddleware, clearTheCart);
export default cartRouter;
