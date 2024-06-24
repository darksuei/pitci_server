import { Request, Response } from "express";
import httpStatus from "http-status";
import { PitchEntity } from "../../entity/PitchEntity";
import { AppDataSource } from "../../database/dataSource";

export async function getPitch(req: Request, res: Response) {
  try {
    const pitch = await AppDataSource.manager.findOne(PitchEntity, {
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
      ],
    });

    return res.status(httpStatus.OK).json({ success: true, pitch });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
