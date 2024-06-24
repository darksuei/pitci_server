import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PersonalInformationEntity } from "./pitchRelations/PersonalInformationEntity";
import { ProfessionalBackgroundEntity } from "./pitchRelations/ProfessionalBackgroundEntity";
import { CompetitionQuestionsEntity } from "./pitchRelations/CompetitionQuestionsEntity";
import { TechnicalAgreementEntity } from "./pitchRelations/TechnicalAgreementEntity";
import { UserEntity } from "./UserEntity";

@Entity("pitch")
export class PitchEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => PersonalInformationEntity, { cascade: true })
  @JoinColumn()
  personal_information!: PersonalInformationEntity;

  @OneToOne(() => ProfessionalBackgroundEntity, { cascade: true })
  @JoinColumn()
  professional_background!: ProfessionalBackgroundEntity;

  @OneToOne(() => CompetitionQuestionsEntity, { cascade: true })
  @JoinColumn()
  competition_questions!: CompetitionQuestionsEntity;

  @OneToOne(() => TechnicalAgreementEntity, { cascade: true })
  @JoinColumn()
  technical_agreement!: TechnicalAgreementEntity;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn()
  user!: UserEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
