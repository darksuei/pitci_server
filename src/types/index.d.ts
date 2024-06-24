import { PitchEntity } from "../entity/PitchEntity";

export type PatchPitchStep =
  | "professional_background"
  | "competition_questions"
  | "technical_agreement"
  | "personal_information";

export interface ISavePitchUpdate {
  pitchUpdate: ProfessionalBackgroundEntity | CompetitionQuestionsEntity | TechnicalAgreementEntity;
  step: PatchPitchStep;
  pitch: PitchEntity;
}
