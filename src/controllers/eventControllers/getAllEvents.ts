import httpStatus from "http-status";
import { Request, Response } from "express";
import { AppDataSource } from "../../database/dataSource";
import { EventEntity } from "../../entity/EventEntity";
import { StorageService } from "../../services/storage";

export async function getAllEvents(_req: Request, res: Response) {
  try {
    const events = await AppDataSource.manager.find(EventEntity, {
      relations: ["otherLinks", "sponsors"],
    });

    for (const event of events) {
      if (event.image_ref) {
        event.image_ref = await StorageService.getInstance().getPreSignedUrl(event.image_ref);
        event.image_ref_last_updated = new Date();
      }
    }

    await AppDataSource.manager.save(events);

    return res.status(httpStatus.OK).json(events);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
