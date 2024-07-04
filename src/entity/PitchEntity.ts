import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => UserEntity, (user) => user.pitch, { onDelete: "CASCADE" })
  @JoinColumn()
  user!: UserEntity;

  @Column({ default: false })
  is_submitted!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
