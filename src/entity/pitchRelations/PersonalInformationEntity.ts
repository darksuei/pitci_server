import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("pitch_personal_information")
export class PersonalInformationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  full_name!: string;

  @Column()
  email!: string;

  @Column()
  phone_number!: string;

  @Column()
  date_of_birth!: Date;

  @Column()
  nationality!: string;

  @Column()
  ethnicity!: string;

  @Column({ type: "boolean", default: false })
  requires_disability_support!: boolean;

  @Column({ nullable: true })
  disability_support_description?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
