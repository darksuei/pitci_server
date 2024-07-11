import httpStatus from "http-status";
import { Request, Response } from "express";
import { ParamIdValidationSchema, validateRequest } from "../../../validators";
import { EventEntity } from "../../../entity/EventEntity";
import { AppDataSource } from "../../../database/dataSource";
import { ApiError } from "../../../middlewares/error";
import * as z from "zod";

export async function deleteEvent(req: Request, res: Response) {
  try {
    validateRequest(ParamIdValidationSchema, req.params);

    const { id } = req.body as z.infer<typeof ParamIdValidationSchema>;

    const event = await AppDataSource.manager.findOne(EventEntity, {
      where: {
        id,
      },
    });

    if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found");

    await AppDataSource.manager.remove(event);

    return res.status(httpStatus.OK).json({ message: "Event deleted successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
