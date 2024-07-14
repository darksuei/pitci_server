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

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  registrationLink!: string;

  @OneToMany(() => LinkEntity, (entity) => entity.event, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn()
  otherLinks!: LinkEntity[];

  @OneToMany(() => SponsorEntity, (entity) => entity.event, {
    onDelete: "CASCADE",
    nullable: true,
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
