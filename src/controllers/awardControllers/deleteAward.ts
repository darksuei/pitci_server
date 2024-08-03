import httpStatus from "http-status";
import { Request, Response } from "express";
import { ParamIdValidationSchema, validateRequest } from "../../validators";
import { AppDataSource } from "../../database/dataSource";
import { ApiError } from "../../middlewares/error";
import * as z from "zod";
import { AwardsEntity } from "../../entity/awardRelations/AwardsEntity";

export async function deleteAward(req: Request, res: Response) {
  try {
    validateRequest(ParamIdValidationSchema, req.params);

    const { id } = req.body as z.infer<typeof ParamIdValidationSchema>;

    const award = await AppDataSource.manager.findOne(AwardsEntity, {
      where: {
        id,
      },
    });

    if (!award) throw new ApiError(httpStatus.NOT_FOUND, "Award not found");

    await AppDataSource.manager.remove(award);

    return res.status(httpStatus.OK).json({ message: "Award deleted successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
