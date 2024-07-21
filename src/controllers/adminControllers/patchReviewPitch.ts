import { Request, Response } from "express";
import httpStatus from "http-status";
import { PatchReviewPitchValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AppDataSource } from "../../database/dataSource";
import { PitchEntity } from "../../entity/PitchEntity";
import { ApiError } from "../../middlewares/error";
import AlertService from "../../services/AlertService";
import { ReviewStatusEnum } from "../../utils/enums";

export async function patchReviewPitch(req: Request, res: Response) {
  try {
    validateRequest(PatchReviewPitchValidationSchema, req.body);

    const { pitchId, reviewStatus } = req.body as z.infer<typeof PatchReviewPitchValidationSchema>;

    const pitch = await AppDataSource.manager.findOne(PitchEntity, {
      where: {
        id: pitchId,
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

    pitch.review.review_status = reviewStatus;
    pitch.review.reviewer_id = req.user!.id;
    pitch.review.reviewer_name = req.user!.full_name;
    pitch.review.review_date = new Date();

    await AppDataSource.manager.save(pitch);

    switch (reviewStatus) {
      case ReviewStatusEnum.APPROVED:
        AlertService.userPitchApproved(pitch.user.id, pitch.id);
        break;
      case ReviewStatusEnum.DECLINED:
        AlertService.userPitchRejected(pitch.user.id, pitch.id);
        break;
    }

    return res.status(httpStatus.OK).json({ message: "Pitch reviewed successfully." });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
