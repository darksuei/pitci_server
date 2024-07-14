import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventEntity } from "../EventEntity";

@Entity("link")
export class LinkEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ nullable: true })
  title!: string;

  @Column()
  url!: string;

  @ManyToOne(() => EventEntity, (entity) => entity.otherLinks, { onDelete: "CASCADE" })
  @JoinColumn()
  event!: EventEntity;

  @CreateDateColumn()
  created_at!: Date;
}
