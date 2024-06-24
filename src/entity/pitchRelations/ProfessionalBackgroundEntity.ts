import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("pitch_professional_background")
export class ProfessionalBackgroundEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  current_occupation!: string;

  @Column({ nullable: true })
  linkedin_url!: string;
}
