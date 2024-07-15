import httpStatus from "http-status";
import { Request, Response } from "express";
import { AppDataSource } from "../../database/dataSource";
import { EventEntity } from "../../entity/EventEntity";

export async function getAllEvents(_req: Request, res: Response) {
  try {
    const events = await AppDataSource.manager.find(EventEntity, {
      relations: ["otherLinks", "sponsors"],
    });

    return res.status(httpStatus.OK).json(events);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
