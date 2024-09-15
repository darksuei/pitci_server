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
  EMAIL_VERIFICATION = "pitci-email-verification",
  FORGOT_PASSWORD = "pitci-forgot-password",
  PHONE_VERIFICATION = "pitci-phone-verification",
}

export enum ReviewStatusEnum {
  NOT_SUBMITTED = "not-submitted",
  PENDING = "pending",
  APPROVED = "approved",
  DECLINED = "declined",
}

export enum GenderEnum {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export enum AwardStatusEnum {
  NOT_STARTED = "not-started",
  NOMINATIONS_OPEN = "nominations-open",
  VOTING_OPEN = "voting-open",
  CLOSED = "closed",
}

export enum NomineeTypeEnum {
  USER = "user",
  BUSINESS = "business",
  PITCH = "pitch",
}

export enum SponsorCategoryEnum {
  GENERAL = "general",
  EVENT = "event",
  AWARD = "award",
  PITCH = "pitch",
  BUSINESS = "business",
}
