import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostInitiatePitchValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { PitchEntity } from "../../entity/PitchEntity";
import { AppDataSource } from "../../database/dataSource";
import { createPersonalInformationProvider } from "../../providers/pitchProvider";

export async function postInitiatePitch(req: Request, res: Response) {
  try {
    const user = req.user!;

    validateRequest(PostInitiatePitchValidationSchema, req.body);

    const personalInformation = await createPersonalInformationProvider(
      req.body as z.infer<typeof PostInitiatePitchValidationSchema>
    );

    let pitch = new PitchEntity();

    pitch.personal_information = personalInformation;

    pitch.user = user;

    pitch = await AppDataSource.manager.save(pitch);

    return res.status(httpStatus.OK).json({ success: true, message: "Pitch saved successfully.", pitch });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
