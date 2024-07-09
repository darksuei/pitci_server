import { AppDataSource } from "../database/dataSource";
import { BusinessEntity } from "../entity/BusinessEntity";
import { PitchEntity } from "../entity/PitchEntity";

export async function createBusiness(pitch: PitchEntity, userId: string) {
  const business = new BusinessEntity();

  business.userId = userId;
  business.business_name = pitch.competition_questions.business_name;
  business.business_description = pitch.competition_questions.business_description;
  business.pitchId = pitch.id;

  return await AppDataSource.manager.save(business);
}
