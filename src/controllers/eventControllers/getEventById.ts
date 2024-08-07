import httpStatus from "http-status";
import { Request, Response } from "express";
import { AppDataSource } from "../../database/dataSource";
import { EventEntity } from "../../entity/EventEntity";
import { ParamIdValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { ApiError } from "../../middlewares/error";
import { StorageService } from "../../services/storage";

export async function getEventById(req: Request, res: Response) {
  try {
    validateRequest(ParamIdValidationSchema, req.params);

    const { id } = req.params as z.infer<typeof ParamIdValidationSchema>;

    const event = await AppDataSource.manager.findOne(EventEntity, {
      where: { id },
      relations: ["otherLinks", "sponsors"],
    });

    if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");

    if (event.image_ref)
      event.image_ref = await StorageService.getInstance().getPreSignedUrl(event.image_ref);

    if (event.sponsor_images_refs) {
      for (let i = 0; i < event.sponsor_images_refs.length; i++) {
        event.sponsor_images_refs[i] =
          (await StorageService.getInstance().getPreSignedUrl(event.sponsor_images_refs[i])) ?? "";
      }
    }

    return res.status(httpStatus.OK).json({ message: "Successfully retrieved event", event });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
