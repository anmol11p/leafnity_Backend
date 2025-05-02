import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("token");
    if (!token) {
      return res.status(404).json({ message: `plz provide token!!` });
    }
    token = token.replace("Bearer", "").trim();
    const secret = process.env.SECRETKEY;
    const data = jwt.verify(token, secret);
    const { email } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
