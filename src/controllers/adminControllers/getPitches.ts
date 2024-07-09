import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../database/dataSource";
import { PitchEntity } from "../../entity/PitchEntity";

export async function getPitches(_req: Request, res: Response) {
  try {
    const pitches = await AppDataSource.manager.find(PitchEntity, {
      where: {
        is_submitted: true,
      },
    });

    return res.status(httpStatus.OK).json(pitches);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
