export enum VerificationStatusEnum {
  PENDING = "pending",
  VERIFIED = "verified",
  UNVERIFIED = "unverified",
  EXPIRED = "expired",
}

export enum RoleEnum {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  USER = "user",
}

export enum NovuTriggersEnum {
  EMAIL_VERIFICATION = "email-verification",
  FORGOT_PASSWORD = "forgot-password",
  PHONE_VERIFICATION = "phone-verification",
}

export enum ReviewStatusEnum {
  NOT_SUBMITTED = "not-submitted",
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined",
}
