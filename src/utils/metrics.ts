import { AppDataSource } from "../database/dataSource";
import { BusinessEntity } from "../entity/BusinessEntity";
import { PitchEntity } from "../entity/PitchEntity";
import { UserEntity } from "../entity/UserEntity";
import { ReviewStatusEnum, RoleEnum } from "./enums";

export async function generateMetrics() {
  return {
    totalPitches: await getTotalPitches(),
    totalUsers: await getTotalUsers(),
    totalBusinesses: await getTotalBusinesses(),
    pendingReviews: await getTotalPitchesByReviewStatus(ReviewStatusEnum.PENDING),
    approvedPitches: await getTotalPitchesByReviewStatus(ReviewStatusEnum.APPROVED),
    declinedPitches: await getTotalPitchesByReviewStatus(ReviewStatusEnum.DECLINED),
  };
}

async function getTotalPitches() {
  const pitches = await AppDataSource.manager.find(PitchEntity, {
    where: {
      is_submitted: true,
    },
  });

  return pitches.length;
}

async function getTotalUsers() {
  const users = await AppDataSource.manager.find(UserEntity, {
    where: {
      role: RoleEnum.USER,
    },
  });

  return users.length;
}

async function getTotalBusinesses() {
  const businesses = await AppDataSource.manager.find(BusinessEntity);

  return businesses.length;
}

async function getTotalPitchesByReviewStatus(status: ReviewStatusEnum) {
  const pitches = await AppDataSource.manager.find(PitchEntity, {
    where: {
      review: {
        review_status: status,
      },
    },
  });

  return pitches.length;
}
