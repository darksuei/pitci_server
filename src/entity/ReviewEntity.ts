import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ReviewStatusEnum } from "../utils/enums";

@Entity("review")
export class ReviewEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "enum", enum: ReviewStatusEnum, default: ReviewStatusEnum.NOT_SUBMITTED })
  review_status!: ReviewStatusEnum;

  @Column({ nullable: true })
  reviewer_id!: string;

  @Column({ nullable: true })
  reviewer_name!: string;

  @Column({ nullable: true })
  review_date!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
