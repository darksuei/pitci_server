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
import { ReviewEntity } from "./ReviewEntity";
import { UserEntity } from "./UserEntity";
import { BusinessEntity } from "./BusinessEntity";

@Entity("meeting")
export class MeetingEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  description!: string;

  @ManyToOne(() => UserEntity, (user) => user.proposed_meetings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "proposer_id" })
  proposer!: UserEntity;

  @ManyToOne(() => BusinessEntity, (business) => business.received_meetings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "recipient_id" })
  recipient!: BusinessEntity;

  @Column({ nullable: true })
  meeting_link?: string;

  @OneToOne(() => ReviewEntity, { onDelete: "CASCADE" })
  @JoinColumn()
  review!: ReviewEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
