import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../database/dataSource";
import { PitchEntity } from "../../entity/PitchEntity";
import { ParamIdValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { ApiError } from "../../middlewares/error";

export async function deletePitch(req: Request, res: Response) {
  try {
    validateRequest(ParamIdValidationSchema, req.params);

    const { id } = req.params as z.infer<typeof ParamIdValidationSchema>;

    const pitch = await AppDataSource.manager.findOne(PitchEntity, {
      where: { id, user: { id: req.user!.id } },
    });

    if (!pitch) throw new ApiError(httpStatus.NOT_FOUND, "Pitch not found");

    await AppDataSource.manager.remove(pitch);

    return res.status(httpStatus.OK).json({ success: true, message: "Pitch Deleted Successfully." });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
