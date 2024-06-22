import { readEnv } from "../config/readEnv.config";

export const SALT_ROUNDS = 10;

export const VERIFICATION_CODE_EXPIRY_TIME = 10 * 60 * 1000;

export const JWT_SECRET = readEnv("JWT_SECRET") as string;

export const JWT_EXPIRES_IN = readEnv("JWT_EXPIRES_IN") as string;
