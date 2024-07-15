import { Request, Response } from "express";
import httpStatus from "http-status";
import { PitchEntity } from "../../entity/PitchEntity";
import { AppDataSource } from "../../database/dataSource";
import { ParamIdValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { ApiError } from "../../middlewares/error";

export async function getPitch(req: Request, res: Response) {
  try {
    validateRequest(ParamIdValidationSchema, req.params);

    const { id } = req.params as z.infer<typeof ParamIdValidationSchema>;

    const pitch = await AppDataSource.manager.findOne(PitchEntity, {
      where: {
        id,
      },
      relations: [
        "user",
        "personal_information",
        "professional_background",
        "competition_questions",
        "technical_agreement",
        "review",
      ],
    });

    if (!pitch) throw new ApiError(httpStatus.NOT_FOUND, "Pitch not found.");

    return res.status(httpStatus.OK).json({ success: true, pitch });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
