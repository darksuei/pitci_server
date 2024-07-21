import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventEntity } from "../EventEntity";

@Entity("sponsor")
export class SponsorEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  website?: string;

  @ManyToOne(() => EventEntity, (entity) => entity.sponsors, { onDelete: "CASCADE" })
  @JoinColumn()
  event!: EventEntity;

  @CreateDateColumn()
  created_at!: Date;
}
