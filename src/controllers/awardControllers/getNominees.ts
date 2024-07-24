import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../database/dataSource";
import { AwardNomineesEntity } from "../../entity/awardRelations/AwardNomineeesEntity";

export async function getNominees(_req: Request, res: Response) {
  try {
    const { id } = _req.params;

    const nominees = await AppDataSource.manager.find(AwardNomineesEntity, {
      where: {
        award: {
          id,
        },
      },
      relations: ["user_nominee", "business_nominee", "pitch_nominee", "votes"],
    });

    return res
      .status(httpStatus.OK)
      .json({ success: true, message: "Nominees retrieved successfully", nominees });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
