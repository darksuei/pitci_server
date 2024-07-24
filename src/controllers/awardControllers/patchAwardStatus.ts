import { Request, Response } from "express";
import httpStatus from "http-status";
import { PatchAwardStatusValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AppDataSource } from "../../database/dataSource";
import { AwardsEntity } from "../../entity/awardRelations/AwardsEntity";
import { ApiError } from "../../middlewares/error";

export async function patchAwardStatus(req: Request, res: Response) {
  try {
    validateRequest(PatchAwardStatusValidationSchema, req.body);

    const { awardId, status } = req.body as z.infer<typeof PatchAwardStatusValidationSchema>;

    const award = await AppDataSource.manager.findOne(AwardsEntity, {
      where: { id: awardId },
    });

    if (!award) throw new ApiError(httpStatus.NOT_FOUND, "Award not found.");

    award.status = status;

    await AppDataSource.manager.save(award);

    return res.status(httpStatus.OK).json({ message: "Awards status updated successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
