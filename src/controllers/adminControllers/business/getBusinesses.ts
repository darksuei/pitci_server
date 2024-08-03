import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../../database/dataSource";
import { BusinessEntity } from "../../../entity/BusinessEntity";

export async function getBusinesses(_req: Request, res: Response) {
  try {
    const businesses = await AppDataSource.manager.find(BusinessEntity);

    return res.status(httpStatus.OK).json(businesses);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
