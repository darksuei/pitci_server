import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";

export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await AppDataSource.manager.find(UserEntity);

    return res.status(httpStatus.OK).json(users);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
