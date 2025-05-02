import express from "express";
import {
  changePassword,
  loginUser,
  updateTheUser,
  UserLogin,
  UserSignUp,
  ForgotPassword,
  resetPassword,
  checkTokenValidity,
} from "../controllers/AuthController.js";
import {
  changePasswordSchema,
  ForgotPasswordSchema,
  LoginSchema,
  signUpSchema,
  updateSchema,
} from "../Schema/Zod.schema.js";
import { zodMiddleware } from "../Middleware/zod.middleware.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
const AuthRouter = express.Router();

AuthRouter.route("/signup").post(zodMiddleware(signUpSchema), UserSignUp);
AuthRouter.route("/login").post(zodMiddleware(LoginSchema), UserLogin);
AuthRouter.route("/forgotPassword").post(
  zodMiddleware(ForgotPasswordSchema),
  ForgotPassword
);
AuthRouter.route("/resetPassword/:token").post(resetPassword);
AuthRouter.route("/tokenValidity/:token").post(checkTokenValidity);
//
AuthRouter.route("/LoginUser").get(authMiddleware, loginUser);
// user update change name email and password;
AuthRouter.route("/updateUser").patch(
  authMiddleware,
  zodMiddleware(updateSchema),
  updateTheUser
);

// user update change password
AuthRouter.route("/changePassword").patch(
  authMiddleware,
  zodMiddleware(changePasswordSchema),
  changePassword
);

export default AuthRouter;
