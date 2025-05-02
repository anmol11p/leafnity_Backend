import { Router } from "express";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAllAdress,
  updateAddress,
} from "../controllers/AdressController.js";
import { zodMiddleware } from "../Middleware/zod.middleware.js";
import { AddressSchema } from "../Schema/Zod.schema.js";
const AddressRouter = Router();

// address create from userInput
AddressRouter.route("/create").post(
  authMiddleware,
  zodMiddleware(AddressSchema),
  createAddress
);
//  address delete by addressId
AddressRouter.route("/delete/:addressId").delete(authMiddleware, deleteAddress);

// get all Adresses
AddressRouter.route("/getAddress").get(authMiddleware, getAllAdress);

// get single Adress
AddressRouter.route("/getAddress/:addressId").get(authMiddleware, getAddress);
// update address by updateId
AddressRouter.route("/update/:addressId").patch(
  authMiddleware,
  zodMiddleware(AddressSchema),
  updateAddress
);

export default AddressRouter;
