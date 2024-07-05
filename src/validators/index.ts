import httpStatus from "http-status";
import logger from "../config/logger.config";
import { ApiError } from "../middlewares/error";
import * as z from "zod";
import { VERIFICATION_CODE_EXPIRY_TIME } from "../utils/constants";
import { PatchPitchStep } from "../types";

export const ParamIdValidationSchema = z.object({
  id: z.string().uuid("Please enter a valid id"),
});

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
  email: z.string().email("Please enter a valid email"),
  verificationCode: z.string().length(6, "Please enter a valid verification code"),
});

export const PatchUserPasswordValidationSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  verificationCode: z.string().length(6, "Please enter a valid verification code"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const PostRequestPhoneNumberChangeValidationSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

export const PatchPhoneNumberValidationSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  verificationCode: z.string().length(6, "Please enter a valid verification code"),
});

export const PostInitiatePitchValidationSchema = z.object({
  fullName: z.string(),
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().date(),
  nationality: z.string(),
  ethnicity: z.string(),
  requiresDisabilitySupport: z.boolean(),
  disabilitySupportDescription: z.string().optional(),
});

export const PatchPersonalInformationValidationSchema = PostInitiatePitchValidationSchema;

export const PatchProfessionalBackroundValidationSchema = z.object({
  currentOccupation: z.string(),
  linkedinUrl: z.string().url(),
});

export const PatchCompetitionQuestionsValidationSchema = z.object({
  businessDescription: z.string(),
  reasonOfInterest: z.string(),
  investmentPrizeUsagePlan: z.string(),
  impactPlanWithInvestmentPrize: z.string(),
  summaryOfWhyYouShouldParticipate: z.string(),
});

export const PatchTechnicalAgreementValidationSchema = z.object({
  haveCurrentInvestors: z.boolean(),
  haveCurrentInvestorsDescription: z.string().optional(),
  haveCurrentEmployees: z.boolean(),
  haveCurrentEmployeesDescription: z.string().optional(),
  haveDebts: z.boolean(),
  haveDebtsDescription: z.string().optional(),
  hasSignedTechnicalAgreement: z.boolean(),
});

export const PatchPitchStepValidationSchema = z.object({
  step: z.enum([
    "personal_information",
    "professional_background",
    "competition_questions",
    "technical_agreement",
  ]),
  id: z.string().uuid("Please enter a valid id"),
});

export const GetResendVerificationCodeValidationSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const PatchNotificationSettingsValidationSchema = z.object({
  notificationStatus: z.boolean().optional(),
  pitchNotificationStatus: z.boolean().optional(),
  eventNotificationStatus: z.boolean().optional(),
  postNotificationStatus: z.boolean().optional(),
});

export const PatchPitchValidationSchemaFactory = (step: PatchPitchStep) => {
  switch (step) {
    case "personal_information":
      return PatchPersonalInformationValidationSchema;
    case "professional_background":
      return PatchProfessionalBackroundValidationSchema;
    case "competition_questions":
      return PatchCompetitionQuestionsValidationSchema;
    case "technical_agreement":
      return PatchTechnicalAgreementValidationSchema;
  }
};

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
