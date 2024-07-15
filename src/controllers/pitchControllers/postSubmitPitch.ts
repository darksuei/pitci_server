import { Request, Response } from "express";
import httpStatus from "http-status";
import { ParamIdValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AppDataSource } from "../../database/dataSource";
import { ApiError } from "../../middlewares/error";
import { PitchEntity } from "../../entity/PitchEntity";
import { createBusiness } from "../../utils/business";
import { ReviewStatusEnum } from "../../utils/enums";
import { devEnvironment } from "../../config/readEnv.config";

export async function postSubmitPitch(req: Request, res: Response) {
  try {
    validateRequest(ParamIdValidationSchema, req.params);

    const { id } = req.params as z.infer<typeof ParamIdValidationSchema>;

    let pitch = await AppDataSource.manager.findOne(PitchEntity, {
      where: { id, user: { id: req.user!.id } },
      relations: [
        "user",
        "personal_information",
        "professional_background",
        "competition_questions",
        "technical_agreement",
        "review",
      ],
    });

    if (!pitch) throw new ApiError(httpStatus.NOT_FOUND, "Pitch not found");

    if (pitch.is_submitted) throw new ApiError(httpStatus.BAD_REQUEST, "Pitch already submitted");

    if (!devEnvironment()) {
      if (
        !pitch.personal_information ||
        !pitch.professional_background ||
        !pitch.competition_questions ||
        !pitch.technical_agreement
      )
        throw new ApiError(httpStatus.BAD_REQUEST, "Incomplete pitch data.");
    }

    pitch.is_submitted = true;

    pitch.review.review_status = ReviewStatusEnum.PENDING;

    // On submission create a business for this pitch application
    await createBusiness(pitch, req.user!.id!);

    pitch = await AppDataSource.manager.save(pitch);

    return res.status(httpStatus.OK).json({ success: true, message: "Pitch Submitted Successfully.", pitch });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
