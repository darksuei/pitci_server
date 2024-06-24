import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("pitch_competition_questions")
export class CompetitionQuestionsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  business_description!: string;

  @Column()
  reason_of_interest!: string;

  @Column()
  investment_prize_usage_plan!: string;

  @Column()
  impact_plan_with_investment_prize!: string;

  @Column()
  summary_of_why_you_should_participate!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
