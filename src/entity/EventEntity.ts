import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LinkEntity } from "./eventRelations/LinkEntity";
import { SponsorEntity } from "./eventRelations/SponsorEntity";

@Entity("events")
export class EventEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  admin_id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  registrationLink!: string;

  @OneToMany(() => LinkEntity, (entity) => entity.event, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  otherLinks!: LinkEntity[];

  @OneToMany(() => SponsorEntity, (entity) => entity.event, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  sponsors!: SponsorEntity[];

  @Column()
  date_time!: Date;

  @Column()
  duration_hours!: Number;

  @Column()
  location!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
