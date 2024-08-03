import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PersonalInformationEntity } from "./pitchRelations/PersonalInformationEntity";
import { ProfessionalBackgroundEntity } from "./pitchRelations/ProfessionalBackgroundEntity";
import { CompetitionQuestionsEntity } from "./pitchRelations/CompetitionQuestionsEntity";
import { TechnicalAgreementEntity } from "./pitchRelations/TechnicalAgreementEntity";
import { UserEntity } from "./UserEntity";
import { ReviewEntity } from "./ReviewEntity";
import { AwardNomineesEntity } from "./awardRelations/AwardNomineeesEntity";

@Entity("pitch")
export class PitchEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => PersonalInformationEntity, { onDelete: "CASCADE" })
  @JoinColumn()
  personal_information!: PersonalInformationEntity;

  @OneToOne(() => ProfessionalBackgroundEntity, { onDelete: "CASCADE" })
  @JoinColumn()
  professional_background!: ProfessionalBackgroundEntity;

  @OneToOne(() => CompetitionQuestionsEntity, { onDelete: "CASCADE" })
  @JoinColumn()
  competition_questions!: CompetitionQuestionsEntity;

  @OneToOne(() => TechnicalAgreementEntity, { onDelete: "CASCADE" })
  @JoinColumn()
  technical_agreement!: TechnicalAgreementEntity;

  @ManyToOne(() => UserEntity, (user) => user.pitch, { onDelete: "CASCADE" })
  @JoinColumn()
  user!: UserEntity;

  @Column({ default: false })
  is_submitted!: boolean;

  @OneToOne(() => ReviewEntity, { onDelete: "CASCADE" })
  @JoinColumn()
  review!: ReviewEntity;

  @OneToMany(() => AwardNomineesEntity, (i) => i.pitch_nominee, { onDelete: "CASCADE" })
  @JoinColumn()
  nominated_for!: AwardNomineesEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
