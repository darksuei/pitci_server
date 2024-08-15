import logger from "../config/logger.config";
import { JWT_SECRET, SALT_ROUNDS } from "./constants";
import jwt from "jsonwebtoken";
import { NomineeTypeEnum, RoleEnum } from "./enums";
import { UserEntity } from "../entity/UserEntity";
import { BusinessEntity } from "../entity/BusinessEntity";
import { PitchEntity } from "../entity/PitchEntity";
import bcrypt from "bcrypt";

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

export async function generateFileName(fileName: string, extension: string): Promise<string> {
  return (await generateRandomHash(fileName)) + "." + extension;
}

export async function generateRandomHash(str: string) {
  const timestamp = new Date().getTime().toString();
  return (await bcrypt.hash(str + timestamp, SALT_ROUNDS)).replace(/[^\w\d]/g, "");
}

export const hoursToMilliSeconds = (hours: number) => hours * 60 * 60 * 1000;

function base36Encode(num: number) {
  const alph = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (num === 0) return alph[0];
  let base36 = "";
  while (num) {
    const i = num % 36;
    base36 = alph[i] + base36;
    num = Math.floor(num / 36);
  }
  return base36;
}

export async function generate8DigitId(uuid: string) {
  // Create a SHA-256 hash of the UUID
  const encoder = new TextEncoder();
  const data = encoder.encode(uuid);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

  // Convert the hashHex to a Base36 encoded string
  const base36Val = parseInt(hashHex, 16);
  const base36Str = base36Encode(base36Val);

  // Return the first 8 alphanumeric characters
  return base36Str.slice(0, 8);
}
