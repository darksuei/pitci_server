import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AwardNomineesEntity } from "./AwardNomineeesEntity";
import { AwardStatusEnum, NomineeTypeEnum } from "../../utils/enums";

@Entity("awards")
export class AwardsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @OneToMany(() => AwardNomineesEntity, (nominee) => nominee.award, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  nominees!: AwardNomineesEntity[];

  @Column({ type: "enum", enum: AwardStatusEnum, default: AwardStatusEnum.NOT_STARTED })
  status!: AwardStatusEnum;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
