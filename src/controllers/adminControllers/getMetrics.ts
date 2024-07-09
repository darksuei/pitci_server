import { Request, Response } from "express";
import httpStatus from "http-status";
import { generateMetrics } from "../../utils/metrics";

export async function getMetrics(_req: Request, res: Response) {
  try {
    const metrics = await generateMetrics();

    return res.status(httpStatus.OK).json(metrics);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
