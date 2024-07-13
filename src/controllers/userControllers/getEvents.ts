import httpStatus from "http-status";
import { Request, Response } from "express";
import { EventEntity } from "../../entity/EventEntity";
import { AppDataSource } from "../../database/dataSource";

export async function getAllEvents(_req: Request, res: Response) {
  try {
    const events = await AppDataSource.manager.find(EventEntity);

    return res.status(httpStatus.OK).json(events);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
