import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostNominateValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AppDataSource } from "../../database/dataSource";
import { AwardNomineesEntity } from "../../entity/awardRelations/AwardNomineeesEntity";
import { ApiError } from "../../middlewares/error";
import { AwardsEntity } from "../../entity/awardRelations/AwardsEntity";
import { getEntityNameFromType } from "../../utils";
import { AwardStatusEnum, NomineeTypeEnum } from "../../utils/enums";
import { UserEntity } from "../../entity/UserEntity";
import { BusinessEntity } from "../../entity/BusinessEntity";
import { PitchEntity } from "../../entity/PitchEntity";
import AlertService from "../../services/AlertService";

export async function postNominate(req: Request, res: Response) {
  try {
    validateRequest(PostNominateValidationSchema, req.body);

    const user = req.user!;

    const userId = user.id;

    const {
      awardId,
      nomineeId,
      nomineeType = NomineeTypeEnum.BUSINESS,
      reason,
    } = req.body as z.infer<typeof PostNominateValidationSchema>;

    const award = await AppDataSource.manager.findOne(AwardsEntity, {
      where: { id: awardId, status: AwardStatusEnum.NOMINATIONS_OPEN },
    });

    if (!award) throw new ApiError(httpStatus.NOT_FOUND, "Award not found or nominations not open yet.");

    const existingNominee = await AppDataSource.manager.findOne(AwardNomineesEntity, {
      where: {
        nominee_id: nomineeId,
        award: { id: awardId },
      },
    });

    if (existingNominee)
      throw new ApiError(httpStatus.CONFLICT, "This nominee already exists under this award category.");

    const nomineeEntity: any = await AppDataSource.manager.findOne(getEntityNameFromType(nomineeType), {
      where: { id: nomineeId },
    });

    if (!nomineeEntity) throw new ApiError(httpStatus.NOT_FOUND, "Nominee not found.");

    let nominee = new AwardNomineesEntity();

    nominee.nominee_id = nomineeId;
    nominee.nominee_type = nomineeType;
    nominee.award = award;
    nominee.reason = reason;
    nominee.nominator_id = userId;

    switch (nomineeType) {
      case NomineeTypeEnum.USER:
        nominee.user_nominee = nomineeEntity as UserEntity;
        break;
      case NomineeTypeEnum.BUSINESS:
        nominee.business_nominee = nomineeEntity as BusinessEntity;
        break;
      case NomineeTypeEnum.PITCH:
        nominee.pitch_nominee = nomineeEntity as PitchEntity;
        break;
    }

    nominee = await AppDataSource.manager.save(nominee);

    // User alert when they are nominated
    await AlertService.awardNomination(nomineeId, award.title, user.notification_status);

    return res.status(httpStatus.CREATED).json({
      success: true,
      message: "Nominee created successfully",
      nominee,
    });
  } catch (e: any) {
    console.log(e);
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
