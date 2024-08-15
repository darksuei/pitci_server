import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostInitiatePitchValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { PitchEntity } from "../../entity/PitchEntity";
import { AppDataSource } from "../../database/dataSource";
import { createPersonalInformationProvider } from "../../providers/pitchProvider";
import { ReviewEntity } from "../../entity/ReviewEntity";
import { ReviewStatusEnum } from "../../utils/enums";
import { UserEntity } from "../../entity/UserEntity";
import { generate8DigitId } from "../../utils";

export async function postInitiatePitch(req: Request, res: Response) {
  try {
    const user = await AppDataSource.manager.findOne(UserEntity, {
      where: { id: req.user!.id },
    });

    validateRequest(PostInitiatePitchValidationSchema, req.body);

    const personalInformation = await createPersonalInformationProvider(
      req.body as z.infer<typeof PostInitiatePitchValidationSchema>
    );

    let pitch = new PitchEntity();

    pitch.personal_information = personalInformation;

    pitch.user = user!;

    let review = new ReviewEntity();

    review.review_status = ReviewStatusEnum.NOT_SUBMITTED;

    review = await AppDataSource.manager.save(review);

    pitch.review = review;

    pitch = await AppDataSource.manager.save(pitch);

    pitch.uid = await generate8DigitId(pitch.id);

    pitch = await AppDataSource.manager.save(pitch);

    return res.status(httpStatus.OK).json({ success: true, message: "Pitch initiated successfully.", pitch });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
