import { AppDataSource } from "../database/dataSource";
import { BusinessEntity } from "../entity/BusinessEntity";
import { PitchEntity } from "../entity/PitchEntity";
import { UserEntity } from "../entity/UserEntity";

export async function createBusiness(pitch: PitchEntity, user: UserEntity) {
  const business = new BusinessEntity();

  business.userId = user.id;
  business.business_name = pitch.competition_questions.business_name;
  business.business_description = pitch.competition_questions.business_description;
  business.pitchId = pitch.id;
  business.business_owner_name = user.full_name;
  business.business_owner_email = user.email;
  user.phone && (business.business_owner_phone = user.phone);

  return await AppDataSource.manager.save(business);
}
