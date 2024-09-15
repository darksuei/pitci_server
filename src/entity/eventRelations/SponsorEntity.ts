import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventEntity } from "../EventEntity";
import { SponsorCategoryEnum } from "../../utils/enums";

@Entity("sponsor")
export class SponsorEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true, type: "enum", enum: SponsorCategoryEnum })
  category!: SponsorCategoryEnum;

  @ManyToOne(() => EventEntity, (entity) => entity.sponsors, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn()
  event?: EventEntity;

  @CreateDateColumn()
  created_at!: Date;
}
