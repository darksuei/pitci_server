import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AwardsEntity } from "./AwardsEntity";
import { VoteEntity } from "./VoteEntity";
import { NomineeTypeEnum } from "../../utils/enums";
import { UserEntity } from "../UserEntity";
import { BusinessEntity } from "../BusinessEntity";
import { PitchEntity } from "../PitchEntity";

@Entity("award_nominees")
export class AwardNomineesEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => UserEntity, (i) => i.nominated_for, { onDelete: "CASCADE" })
  @JoinColumn()
  user_nominee!: UserEntity;

  @ManyToOne(() => BusinessEntity, (i) => i.nominated_for, { onDelete: "CASCADE" })
  @JoinColumn()
  business_nominee!: BusinessEntity;

  @ManyToOne(() => PitchEntity, (i) => i.nominated_for, { onDelete: "CASCADE" })
  @JoinColumn()
  pitch_nominee!: PitchEntity;

  @Column()
  nominee_id!: string;

  @Column({ type: "enum", enum: NomineeTypeEnum, nullable: true })
  nominee_type!: NomineeTypeEnum;

  @Column({ nullable: true })
  reason?: string;

  @Column()
  nominator_id!: string;

  @ManyToOne(() => AwardsEntity, (award) => award.nominees, { onDelete: "CASCADE" })
  @JoinColumn()
  award!: AwardsEntity;

  @OneToMany(() => VoteEntity, (vote) => vote.nominee, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  votes!: VoteEntity[];

  @Column({ default: 0 })
  votes_count!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
