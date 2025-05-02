import {
  checkExpirationTime,
  checkUserByEmail,
  deleteAllData,
  findUserByToken,
  GeneratejwtToken,
  saveUserToDB,
  sendResetEmail,
  storeResetToken,
  updatePassword,
  updatePasswordForgotRoute,
  updateUser,
  verifyPassword,
} from "../ImpFunctions/Auth.function.js";
import argon from "argon2";
import crypto from "crypto";
import { sendResetPassword } from "../ImpFunctions/ResendForgotPassword.js";
const UserSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await checkUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: `${existingUser.email} is already present plz try with new email id`,
      });
    }
    const hashPassword = await argon.hash(password);
    await saveUserToDB({ name, email, password: hashPassword });
    const token = await GeneratejwtToken(email);
    return res
      .status(201)
      .json({ message: `user created successfully`, token });
  } catch (error) {
    next(error);
  }
};

const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await checkUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ message: `you're not registered...` });
    }
    const isPasswordMatch = await verifyPassword(existingUser, password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: `Invalid Credentials` });
    }
    const token = await GeneratejwtToken(email);
    return res
      .status(200)
      .json({ message: `you're logged in successfully...`, token });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: `user is not founded...` });
    }
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateTheUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = req.user;
    const { id } = user;
    if (name !== user.name && email === user.email) {
      // update username
      await updateUser(name, email, id);
      const newtoken = await GeneratejwtToken(email);
      return res
        .status(200)
        .json({ message: "username changed successfully", token: newtoken });
    }
    if (email === user.email && name === user.name) {
      return res.status(400).json({ message: "No changes detected" });
    }
    const existingUser = await checkUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: `user is already existed with this email id ${existingUser.email}`,
      });
    }

    const resp = await updateUser(name, email, id);
    if (!resp) {
      return res.status(500).json({ message: "User update failed" });
    }
    const newtoken = await GeneratejwtToken(email);
    return res
      .status(200)
      .json({ message: "user updated successfully", token: newtoken });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const user = req.user;
    const isPasswordMatch = await verifyPassword(user, password);
    if (!isPasswordMatch) {
      return res.status(404).json({ message: "plz enter correct password" });
    }
    const hashPassword = await argon.hash(newPassword);
    const resp = await updatePassword(user, hashPassword);
    const token = await GeneratejwtToken(user.email);
    return res
      .status(200)
      .json({ message: `password change successfully`, resp, token });
  } catch (error) {
    next(error);
  }
};

// const  = async (req, res, next) => {
const ForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await checkUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({
        message: `email ${email} not  found!`,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); //1 hour expiration time

    // store token in db
    await storeResetToken(existingUser.email, resetToken, expiresAt);
    // sendEmail
    const BASE_URL =
      process.env.FRONTEND_URL?.trim() || "http://localhost:5173";
    const resetLink = `${BASE_URL}/reset-password/${resetToken}`;
    // await sendResetEmail(existingUser.email, resetLink);
    const resp = await sendResetPassword(existingUser.email, resetLink);
    console.log("resp", resp);
    if (!resp.success) {
      return res
        .status(400)
        .json({ message: "error sending link to the mail" });
    }
    return res
      .status(200)
      .json({ message: "Password Reset Link Sent To Email" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res.status(404).json({ message: "token is not founded.." });
  }
  const { newPassword } = req.body;
  if (!newPassword) {
    return res.status(404).json({ message: "plz provide new password" });
  }
  try {
    const user = await findUserByToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hashPassword = await argon.hash(newPassword);
    await updatePasswordForgotRoute(user.id, hashPassword);
    return res
      .status(200)
      .json({ message: "password has been reset successfully.." });
  } catch (error) {
    next(error);
  }
};

const checkTokenValidity = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(404).json({ message: "token is not provided.." });
    }
    const user = await checkExpirationTime(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    return res.status(200).json({ message: "Valid token" });
  } catch (error) {
    next(error);
  }
};
export {
  checkTokenValidity,
  UserLogin,
  UserSignUp,
  loginUser,
  updateTheUser,
  changePassword,
  ForgotPassword,
  resetPassword,
};
