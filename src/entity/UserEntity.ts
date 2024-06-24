import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { AuthEntity } from "./AuthEntity";
import { RoleEnum } from "../utils/enums";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  full_name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  forgot_password_code!: string;

  @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.USER })
  role!: RoleEnum;

  @OneToOne(() => AuthEntity, (entity) => entity.user)
  @JoinColumn()
  auth!: AuthEntity;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
