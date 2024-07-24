import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../database/dataSource";
import { AwardsEntity } from "../../entity/awardRelations/AwardsEntity";
import { AwardStatusEnum } from "../../utils/enums";
import { In } from "typeorm";

export async function getAwardsUser(_req: Request, res: Response) {
  try {
    const awards = await AppDataSource.manager.find(AwardsEntity, {
      where: { status: In([AwardStatusEnum.NOMINATIONS_OPEN, AwardStatusEnum.VOTING_OPEN]) },
      relations: ["nominees", "nominees.user_nominee", "nominees.business_nominee", "nominees.pitch_nominee"],
    });

    return res
      .status(httpStatus.OK)
      .json({ success: true, message: "Awards retrieved successfully", awards });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}

export async function getAwardsAdmin(_req: Request, res: Response) {
  try {
    const awards = await AppDataSource.manager.find(AwardsEntity, {
      relations: ["nominees", "nominees.user_nominee", "nominees.business_nominee", "nominees.pitch_nominee"],
    });

    return res
      .status(httpStatus.OK)
      .json({ success: true, message: "Awards retrieved successfully", awards });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
