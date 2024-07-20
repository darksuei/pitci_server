import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../../database/dataSource";
import { AlertEntity } from "../../../entity/AlertEntity";

export async function getAlerts(req: Request, res: Response) {
  try {
    const user = req.user!;

    const alerts = await AppDataSource.manager.find(AlertEntity, {
      where: { userId: user.id },
    });

    return res.status(httpStatus.OK).json(alerts);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
