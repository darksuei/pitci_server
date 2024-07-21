import * as z from "zod";
import {
  PatchCompetitionQuestionsValidationSchema,
  PatchPersonalInformationValidationSchema,
  PatchProfessionalBackroundValidationSchema,
  PatchTechnicalAgreementValidationSchema,
  PostInitiatePitchValidationSchema,
} from "../validators";
import { ProfessionalBackgroundEntity } from "../entity/pitchRelations/ProfessionalBackgroundEntity";
import { AppDataSource } from "../database/dataSource";
import { CompetitionQuestionsEntity } from "../entity/pitchRelations/CompetitionQuestionsEntity";
import { TechnicalAgreementEntity } from "../entity/pitchRelations/TechnicalAgreementEntity";
import { ISavePitchUpdate, PatchPitchStep } from "../types";
import { PersonalInformationEntity } from "../entity/pitchRelations/PersonalInformationEntity";

export async function createPersonalInformationProvider(
  payload: z.infer<typeof PostInitiatePitchValidationSchema>
) {
  const personal_information = new PersonalInformationEntity();
  personal_information.date_of_birth = new Date(payload.dateOfBirth);
  personal_information.email = payload.email;
  personal_information.ethnicity = payload.ethnicity;
  personal_information.full_name = payload.fullName;
  personal_information.nationality = payload.nationality;
  personal_information.phone_number = payload.phoneNumber;
  personal_information.gender = payload.gender;
  personal_information.requires_disability_support = payload.requiresDisabilitySupport;
  payload.disabilitySupportDescription &&
    (personal_information.disability_support_description = payload.disabilitySupportDescription);

  return await AppDataSource.manager.save(personal_information);
}

export async function createProfessionalBackgroundProvider(
  payload: z.infer<typeof PatchProfessionalBackroundValidationSchema>
) {
  const professionalBackground = new ProfessionalBackgroundEntity();
  professionalBackground.current_occupation = payload.currentOccupation;
  professionalBackground.linkedin_url = payload.linkedinUrl;

  return await AppDataSource.manager.save(professionalBackground);
}

export async function createCompetitionQuestionsProvider(
  payload: z.infer<typeof PatchCompetitionQuestionsValidationSchema>
) {
  const competitionQuestions = new CompetitionQuestionsEntity();

  payload.businessName && (competitionQuestions.business_name = payload.businessName);
  competitionQuestions.business_description = payload.businessDescription;
  competitionQuestions.reason_of_interest = payload.reasonOfInterest;
  competitionQuestions.investment_prize_usage_plan = payload.investmentPrizeUsagePlan;
  competitionQuestions.impact_plan_with_investment_prize = payload.impactPlanWithInvestmentPrize;
  competitionQuestions.summary_of_why_you_should_participate = payload.summaryOfWhyYouShouldParticipate;

  return await AppDataSource.manager.save(competitionQuestions);
}

export async function createTechnicalAgreementProvider(
  payload: z.infer<typeof PatchTechnicalAgreementValidationSchema>
) {
  const technicalAgreement = new TechnicalAgreementEntity();

  technicalAgreement.have_current_investors = payload.haveCurrentInvestors;
  payload.haveCurrentInvestorsDescription &&
    (technicalAgreement.have_current_investors_description = payload.haveCurrentInvestorsDescription);
  technicalAgreement.have_current_employees = payload.haveCurrentEmployees;
  payload.haveCurrentEmployeesDescription &&
    (technicalAgreement.have_current_employees_description = payload.haveCurrentEmployeesDescription);
  technicalAgreement.have_debts = payload.haveDebts;
  payload.haveDebtsDescription && (technicalAgreement.have_debts_description = payload.haveDebtsDescription);
  technicalAgreement.has_signed_technical_agreement = payload.hasSignedTechnicalAgreement;

  return await AppDataSource.manager.save(technicalAgreement);
}

export async function createPitchUpdateFactory(
  step: PatchPitchStep,
  payload:
    | z.infer<typeof PatchPersonalInformationValidationSchema>
    | z.infer<typeof PatchTechnicalAgreementValidationSchema>
    | z.infer<typeof PatchCompetitionQuestionsValidationSchema>
    | z.infer<typeof PatchProfessionalBackroundValidationSchema>
) {
  switch (step) {
    case "personal_information":
      return await createPersonalInformationProvider(
        payload as z.infer<typeof PatchPersonalInformationValidationSchema>
      );
    case "professional_background":
      return await createProfessionalBackgroundProvider(
        payload as z.infer<typeof PatchProfessionalBackroundValidationSchema>
      );
    case "competition_questions":
      return await createCompetitionQuestionsProvider(
        payload as z.infer<typeof PatchCompetitionQuestionsValidationSchema>
      );
    case "technical_agreement":
      return await createTechnicalAgreementProvider(
        payload as z.infer<typeof PatchTechnicalAgreementValidationSchema>
      );
  }
}

export async function savePitchUpdateProvider({ pitchUpdate, step, pitch }: ISavePitchUpdate) {
  switch (step) {
    case "personal_information":
      pitch.personal_information = pitchUpdate as PersonalInformationEntity;
      break;
    case "professional_background":
      pitch.professional_background = pitchUpdate as ProfessionalBackgroundEntity;
      break;
    case "competition_questions":
      pitch.competition_questions = pitchUpdate as CompetitionQuestionsEntity;
      break;
    case "technical_agreement":
      pitch.technical_agreement = pitchUpdate as TechnicalAgreementEntity;
      break;
  }

  return await AppDataSource.manager.save(pitch);
}
