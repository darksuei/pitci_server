import logger from "../config/logger.config";
import { JWT_SECRET } from "./constants";
import jwt from "jsonwebtoken";

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function signToken<T extends object>(payload: T, expire?: number) {
  return jwt.sign(
    {
      ...payload,
      iat: new Date().getTime(),
      exp: expire || new Date().getTime() + 1000 * 60 * 60 * 24,
      iss: "upi_server",
    },
    JWT_SECRET
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token.replace(/Bearer/g, "").trim(), JWT_SECRET);
  } catch (error) {
    logger.error("Error verifying JWT token:", error);
    return null;
  }
}
