import { Request, Response } from "express";
import httpStatus from "http-status";
import { PatchReviewMeetingScheduleValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AppDataSource } from "../../database/dataSource";
import { MeetingEntity } from "../../entity/MeetingEntity";
import { ApiError } from "../../middlewares/error";
import { ReviewStatusEnum } from "../../utils/enums";

export async function patchReviewMeetingSchedule(req: Request, res: Response) {
  try {
    validateRequest(PatchReviewMeetingScheduleValidationSchema, req.body);

    const { meetingId, reviewStatus, meetingLink } = req.body as z.infer<
      typeof PatchReviewMeetingScheduleValidationSchema
    >;

    let meeting = await AppDataSource.manager.findOne(MeetingEntity, {
      where: { id: meetingId },
      relations: ["review", "proposer", "recipient"],
    });

    if (!meeting) throw new ApiError(httpStatus.NOT_FOUND, "Meeting not found");

    if (meeting.review?.review_status !== ReviewStatusEnum.PENDING)
      throw new ApiError(httpStatus.BAD_REQUEST, "Meeting already reviewed");

    meeting.meeting_link = meetingLink;
    meeting.review.review_status = reviewStatus;
    meeting.review.reviewer_name = req.user?.full_name;
    meeting.review.reviewer_id = req.user!.id;
    meeting.review.review_date = new Date();

    await AppDataSource.manager.save(meeting);

    return res.status(httpStatus.OK).json({ message: "Meeting reviewed successfully", meeting });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
