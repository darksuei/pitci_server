import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";
import { VerificationStatusEnum } from "../utils/enums";

@Entity("auth")
export class AuthEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  sessionId!: string;

  @OneToOne(() => UserEntity, (entity) => entity.auth, { onDelete: "CASCADE" })
  @JoinColumn()
  user!: UserEntity;

  @Column({ default: "" })
  verificationCode!: string;

  @Column({
    type: "enum",
    enum: VerificationStatusEnum,
    default: VerificationStatusEnum.UNVERIFIED,
    nullable: true,
  })
  verificationStatus!: VerificationStatusEnum;

  @Column({
    nullable: true,
    type: "timestamp",
  })
  verificationTimeStamp?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
