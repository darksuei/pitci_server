import logger from "../config/logger.config";
import { JWT_SECRET } from "./constants";
import jwt from "jsonwebtoken";
import { NomineeTypeEnum, RoleEnum } from "./enums";
import { UserEntity } from "../entity/UserEntity";
import { BusinessEntity } from "../entity/BusinessEntity";
import { PitchEntity } from "../entity/PitchEntity";

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function signToken<T extends object>(payload: T, expire?: number) {
  return jwt.sign(
    {
      ...payload,
      iat: new Date().getTime(),
      exp: expire || new Date().getTime() + 1000 * 60 * 60 * 24,
      iss: "pitci_server",
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

export function checkIfAdmin(role: RoleEnum) {
  return role === RoleEnum.ADMIN || role === RoleEnum.SUPER_ADMIN;
}

export function getEntityNameFromType(type: NomineeTypeEnum) {
  switch (type) {
    case NomineeTypeEnum.USER:
      return UserEntity;
    case NomineeTypeEnum.BUSINESS:
      return BusinessEntity;
    case NomineeTypeEnum.PITCH:
      return PitchEntity;
    default:
      return UserEntity;
  }
}
