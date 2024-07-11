import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
