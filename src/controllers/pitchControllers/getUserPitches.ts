import { Request, Response } from "express";
import httpStatus from "http-status";
import { PitchEntity } from "../../entity/PitchEntity";
import { AppDataSource } from "../../database/dataSource";

export async function getUserPitches(req: Request, res: Response) {
  try {
    const pitches = await AppDataSource.manager.find(PitchEntity, {
      where: {
        user: {
          id: req.user!.id,
        },
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

    return res.status(httpStatus.OK).json({ success: true, pitches });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
