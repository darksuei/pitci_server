import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../UserEntity";
import { AwardNomineesEntity } from "./AwardNomineeesEntity";

@Entity("votes")
export class VoteEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => UserEntity, (entity) => entity.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user!: UserEntity;

  @ManyToOne(() => AwardNomineesEntity, (nominee) => nominee.votes)
  @JoinColumn({ name: "vote" })
  nominee!: AwardNomineesEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
