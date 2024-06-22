import { Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../../types/express";

export async function getUser(req: AuthRequest, res: Response) {
  try {
    const { user } = req;
    return res.status(httpStatus.OK).json({ success: true, user });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
