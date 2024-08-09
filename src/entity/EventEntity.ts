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
  day?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  registrationLink?: string;

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

  @Column({ nullable: true })
  duration_hours?: string;

  @Column()
  location!: string;

  @Column({ nullable: true })
  image_ref?: string;

  @Column({ nullable: true })
  image_ref_last_updated?: Date;

  @Column({ type: "jsonb", nullable: true })
  sponsor_images_refs?: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
