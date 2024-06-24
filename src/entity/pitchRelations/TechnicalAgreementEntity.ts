import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("pitch_technical_agreement")
export class TechnicalAgreementEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  have_current_investors!: boolean;

  @Column({ nullable: true })
  have_current_investors_description!: string;

  @Column()
  have_current_employees!: boolean;

  @Column({ nullable: true })
  have_current_employees_description!: string;

  @Column()
  have_debts!: boolean;

  @Column({ nullable: true })
  have_debts_description!: string;

  @Column()
  has_signed_technical_agreement!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
