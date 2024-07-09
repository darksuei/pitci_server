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

  @OneToOne(() => AuthEntity, (entity) => entity.user)
  @JoinColumn()
  auth!: AuthEntity;

  @OneToMany(() => PitchEntity, (pitch) => pitch.user, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  pitch!: PitchEntity[];

  @Column({ default: false })
  notification_status!: boolean;

  @Column({ default: false })
  pitch_notification_status!: boolean;

  @Column({ default: false })
  post_notification_status!: boolean;

  @Column({ default: false })
  event_notification_status!: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
