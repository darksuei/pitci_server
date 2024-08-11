import { Request, Response } from "express";
import httpStatus from "http-status";
import { ApiError } from "../../middlewares/error";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";
import { BusinessEntity } from "../../entity/BusinessEntity";
import { PitchEntity } from "../../entity/PitchEntity";
import { ILike } from "typeorm";

export async function getSearchByQueryString(req: Request, res: Response) {
  try {
    const { query } = req.query;

    if (!query) throw new ApiError(httpStatus.BAD_REQUEST, "Query is required");

    const user_results = await AppDataSource.manager.find(UserEntity, {
      where: { full_name: ILike(`%${query as string}%`) },
    });

    const business_results = await AppDataSource.manager.find(BusinessEntity, {
      where: [{ business_name: ILike(`%${query as string}%`) }],
    });

    const pitch_results = await AppDataSource.manager.find(PitchEntity, {
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

    return res.status(httpStatus.OK).json({
      results: [...user_results, ...business_results, ...pitch_results],
    });
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal Server Error",
    });
  }
}
