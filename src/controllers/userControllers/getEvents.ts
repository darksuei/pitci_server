import httpStatus from "http-status";
import { Request, Response } from "express";
import { EventEntity } from "../../entity/EventEntity";
import { AppDataSource } from "../../database/dataSource";
import StorageService from "../../services/storage";
import { hoursToMilliSeconds } from "../../utils";

export async function getEvents(_req: Request, res: Response) {
  try {
    let events = await AppDataSource.manager.find(EventEntity, {
      relations: ["otherLinks", "sponsors"],
    });

    for (const event of events) {
      const lastUpdated = event.image_url_last_updated?.getTime() ?? 0;
      const currentTime = Date.now();

      const storageService = new StorageService();

      if (event.image_ref && currentTime - lastUpdated > hoursToMilliSeconds(12)) {
        event.image_url = await storageService.getPreSignedUrl(event.image_ref);
        event.image_url_last_updated = new Date();
      }
    }

    events = await AppDataSource.manager.save(events);

    return res.status(httpStatus.OK).json(events);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
