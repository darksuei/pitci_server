import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("business")
export class BusinessEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  business_name!: string;

  @Column()
  business_description!: string;

  @Column({ nullable: true })
  business_owner_name?: string;

  @Column({ nullable: true })
  business_owner_email?: string;

  @Column({ nullable: true })
  business_owner_phone?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  logo?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
