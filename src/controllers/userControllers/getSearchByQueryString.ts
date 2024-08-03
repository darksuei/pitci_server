import { Request, Response } from "express";
import httpStatus from "http-status";
import { ApiError } from "../../middlewares/error";
import { NomineeTypeEnum } from "../../utils/enums";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";
import { BusinessEntity } from "../../entity/BusinessEntity";
import { PitchEntity } from "../../entity/PitchEntity";
import { ILike } from "typeorm";

export async function getSearchByQueryString(req: Request, res: Response) {
  try {
    const { type, query } = req.query;

    validateQueryTypeAndQuery(type as NomineeTypeEnum, query as string);

    console.log(query);

    let results: any[] = [];

    switch (type as NomineeTypeEnum) {
      case NomineeTypeEnum.USER:
        results = await AppDataSource.manager.find(UserEntity, {
          where: { full_name: ILike(`%${query as string}%`) },
        });
        break;

      case NomineeTypeEnum.BUSINESS:
        results = await AppDataSource.manager.find(BusinessEntity, {
          where: [{ business_name: ILike(`%${query as string}%`) }],
        });
        break;

      case NomineeTypeEnum.PITCH:
        results = await AppDataSource.manager.find(PitchEntity, {
          where: [
            {
              personal_information: {
                full_name: ILike(`%${query as string}%`),
              },
            },
            {
              competition_questions: {
                business_name: ILike(`%${query as string}%`),
              },
            },
          ],
        });
        break;
    }

    return res.status(httpStatus.OK).json({ results });
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal Server Error",
    });
  }
}

function validateQueryTypeAndQuery(type: NomineeTypeEnum, query: string) {
  if (type !== "user" && type !== "pitch" && type !== "business") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid query type");
  }
  if (!query) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Query is required");
  }
}
