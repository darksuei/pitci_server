import { Request, Response } from "express";
import httpStatus from "http-status";
import {
  PatchPitchStepValidationSchema,
  PatchPitchValidationSchemaFactory,
  validateRequest,
  validateRequestAsync,
} from "../../validators";
import * as z from "zod";
import { createPitchUpdateFactory, savePitchUpdateProvider } from "../../providers/pitchProvider";
import { AppDataSource } from "../../database/dataSource";
import { PitchEntity } from "../../entity/PitchEntity";
import { ApiError } from "../../middlewares/error";
import { BusinessEntity } from "../../entity/BusinessEntity";

export async function patchPitch(req: Request, res: Response) {
  try {
    await validateRequestAsync(PatchPitchStepValidationSchema, req.params, async () => {
      if (req.params.step === "competition_questions" && req.body.business_name) {
        const business = await AppDataSource.manager.findOne(BusinessEntity, {
          where: { business_name: req.body.business_name },
        });

        if (business) throw new ApiError(httpStatus.BAD_REQUEST, "Business name already exists");
      }
    });

    const { id, step } = req.params as z.infer<typeof PatchPitchStepValidationSchema>;

    validateRequest(PatchPitchValidationSchemaFactory(step), req.body);

    let pitch = await AppDataSource.manager.findOne(PitchEntity, {
      where: {
        id,
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

    if (!pitch) throw new ApiError(httpStatus.NOT_FOUND, "Pitch not found");

    const pitchUpdate = await createPitchUpdateFactory(step, req.body);

    pitch = await savePitchUpdateProvider({ pitchUpdate, step, pitch });

    return res.status(httpStatus.OK).json({ success: true, message: "Pitch updated successfully", pitch });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
