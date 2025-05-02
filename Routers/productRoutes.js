import express from "express";
import {
  getAllProducts,
  getSearchProducts,
  saveAllProducts,
} from "../controllers/productController.js";

const productRouter = express.Router();

// data post in db

productRouter.route("/").get(getAllProducts);
productRouter.route("/saveAllProduct").post(saveAllProducts);
// search functionality
productRouter.route("/").post(getSearchProducts);
export default productRouter;
