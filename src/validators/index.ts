import httpStatus from "http-status";
import logger from "../config/logger.config";
import { ApiError } from "../middlewares/error";
import * as z from "zod";
import { VERIFICATION_CODE_EXPIRY_TIME } from "../utils/constants";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string(),
});

export const RegisterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  fullName: z.string(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const VerifyCodeValidationSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  code: z.string().length(6, "Please enter a valid verification code"),
});

export const PostRequestForgotPasswordEmailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const PostVerifyForgotPasswordCodeValidationSchema = z.object({
  verificationCode: z.string().length(6, "Please enter a valid verification code"),
});

export const PatchUserPasswordValidationSchema = z.object({
  verificationCode: z.string().length(6, "Please enter a valid verification code"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export function validateRequest<T>(schema: z.ZodTypeAny, payload: T, validationFunction?: Function) {
  try {
    schema.parse(payload);
    validationFunction && validationFunction();
  } catch (e: any) {
    logger.error("Validation error: %o", e);
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, e.message ?? "Validation error");
  }
}

export function validateExpiryTime(time: number, expiryTime: number = VERIFICATION_CODE_EXPIRY_TIME) {
  const timeDifference = Date.now() - time;
  if (timeDifference > expiryTime) throw new ApiError(httpStatus.BAD_REQUEST, "Verification code expired");
}
