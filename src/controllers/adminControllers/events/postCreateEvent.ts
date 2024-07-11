import httpStatus from "http-status";
import { Request, Response } from "express";
import { PostCreateEventValidationSchema, validateRequest } from "../../../validators";
import * as z from "zod";
import { EventEntity } from "../../../entity/EventEntity";
import { AppDataSource } from "../../../database/dataSource";

export async function postCreateEvent(req: Request, res: Response) {
  try {
    validateRequest(PostCreateEventValidationSchema, req.body);

    const { title, description, location, dateTime, durationHours } = req.body as z.infer<
      typeof PostCreateEventValidationSchema
    >;

    const event = new EventEntity();
    event.admin_id = req.user!.id;
    event.title = title;
    event.description = description;
    event.location = location;
    event.date_time = new Date(dateTime);
    event.duration_hours = durationHours;

    await AppDataSource.manager.save(event);

    return res.status(httpStatus.CREATED).json({ message: "Event created successfully", event });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
