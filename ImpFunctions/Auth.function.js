import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import argon from "argon2";
import nodemailer from "nodemailer";
const prisma = new PrismaClient();

let htmlCode = (resetLink) => {
  return ` <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
      
      <!-- Logo -->
      <div style="text-align: center;">
       Leafnity
      </div>

      <!-- Title -->
      <h2 style="color: #2e7d32; margin-bottom: 10px;">Reset Your Password</h2>

      <!-- Message -->
      <p style="color: #555; font-size: 16px;">
        We received a request to reset your password. Click the button below to proceed.
      </p>

      <!-- Reset Button -->
      <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; margin: 15px 0; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; border-radius: 5px; font-weight: bold;">
        Reset Password
      </a>

      <p style="color: #777; font-size: 14px;">Or copy and paste the link below into your browser:</p>

      <!-- Reset Link -->
      <p style="word-wrap: break-word; color: #4CAF50; font-size: 14px;">${resetLink}</p>

      <p style="color: #999; font-size: 12px;">This link is valid for 1 hour.</p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

      <!-- Footer -->
      <p style="color: #888; font-size: 12px;">If you didn’t request a password reset, please ignore this email.</p>
      <p style="color: #888; font-size: 12px;">&copy; 2025 Leafnity. All rights reserved.</p>

    </div>
`;
};

const deleteAllData = async () => {
  try {
    const resp = await prisma.user.deleteMany();
    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};
const checkUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    return error;
  }
};

const saveUserToDB = async (data) => {
  try {
    const { name, email, password } = data;
    const response = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const GeneratejwtToken = async (email) => {
  try {
    const token = jwt.sign(
      {
        email,
      },
      process.env.SECRETKEY,
      { expiresIn: "2d" }
    );
    return token;
  } catch (error) {
    return error;
  }
};

const verifyPassword = async (user, password) => {
  try {
    const hashPassword = user.password;
    const resp = await argon.verify(hashPassword, password);
    return resp;
  } catch (error) {
    return error;
  }
};

const updateUser = async (name, email, id) => {
  try {
    const resp = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const updatePassword = async (user, password) => {
  try {
    const resp = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: password,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const storeResetToken = async (email, resetToken, resetTokenExpires) => {
  try {
    const resp = await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const findUserByToken = async (resetToken) => {
  try {
    const resp = await prisma.user.findFirst({
      where: {
        resetToken,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
const updatePasswordForgotRoute = async (id, password) => {
  try {
    const resp = await prisma.user.update({
      where: { id },
      data: {
        password,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const checkExpirationTime = async (token) => {
  try {
    const resp = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gte: new Date(),
        },
      },
    });
    return resp;
  } catch (error) {
    console.log("error in auth route in toke validity", error);
    return;
  }
};
const sendResetEmail = async (email, resetLink) => {
  try {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    let transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: htmlCode(resetLink),
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
export {
  checkExpirationTime,
  storeResetToken,
  updatePasswordForgotRoute,
  findUserByToken,
  updatePassword,
  updateUser,
  deleteAllData,
  verifyPassword,
  sendResetEmail,
  GeneratejwtToken,
  saveUserToDB,
  checkUserByEmail,
};
