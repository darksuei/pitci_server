import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { AuthEntity } from "./AuthEntity";
import { RoleEnum } from "../utils/enums";
import { PitchEntity } from "./PitchEntity";
import { MeetingEntity } from "./MeetingEntity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  full_name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  forgot_password_code!: string;

  @Column({ nullable: true })
  phone_verification_code!: string;

  @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.USER })
  role!: RoleEnum;

  @OneToOne(() => AuthEntity, (entity) => entity.user, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  auth!: AuthEntity;

  @OneToMany(() => PitchEntity, (pitch) => pitch.user, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  pitch!: PitchEntity[];

  @Column({ default: true })
  notification_status!: boolean;

  @Column({ default: true })
  pitch_notification_status!: boolean;

  @Column({ default: true })
  post_notification_status!: boolean;

  @Column({ default: true })
  event_notification_status!: boolean;

  @OneToMany(() => MeetingEntity, (meeting) => meeting.proposer, { onDelete: "CASCADE" })
  proposed_meetings!: MeetingEntity[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
