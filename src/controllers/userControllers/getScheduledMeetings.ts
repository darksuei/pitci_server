import { Request, Response } from "express";
import { AppDataSource } from "../../database/dataSource";
import { MeetingEntity } from "../../entity/MeetingEntity";
import httpStatus from "http-status";

export async function getScheduledMeetings(req: Request, res: Response) {
  try {
    const user = req.user!;

    const meetings = await AppDataSource.manager.find(MeetingEntity, {
      where: [{ proposer: { id: user.id } }, { recipient: { id: user.id } }],
      relations: ["proposer", "recipient", "review"],
    });

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Meetings fetched successfully.",
      meetings,
    });
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal Server Error",
    });
  }
}
