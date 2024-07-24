import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostScheduleMeetingValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AppDataSource } from "../../database/dataSource";
import { ApiError } from "../../middlewares/error";
import { MeetingEntity } from "../../entity/MeetingEntity";
import { ReviewEntity } from "../../entity/ReviewEntity";
import { ReviewStatusEnum } from "../../utils/enums";
import { BusinessEntity } from "../../entity/BusinessEntity";

export async function postScheduleMeeting(req: Request, res: Response) {
  try {
    validateRequest(PostScheduleMeetingValidationSchema, req.body);

    const { description, recipientId } = req.body as z.infer<typeof PostScheduleMeetingValidationSchema>;

    const proposer = req.user!;

    const recipient = await AppDataSource.manager.findOne(BusinessEntity, {
      where: { id: recipientId },
    });

    if (!proposer || !recipient) throw new ApiError(httpStatus.NOT_FOUND, "Proposer or reciepient not found");

    let review = new ReviewEntity();

    review.review_status = ReviewStatusEnum.PENDING;

    review = await AppDataSource.manager.save(review);

    const meeting = new MeetingEntity();

    meeting.description = description;
    meeting.proposer = proposer;
    meeting.recipient = recipient;
    meeting.review = review;

    await AppDataSource.manager.save(meeting);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Meeting schedule successfully submitted to admin for approval.",
      meeting,
    });
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal Server Error",
    });
  }
}
