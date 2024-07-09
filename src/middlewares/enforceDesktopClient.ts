import { NextFunction, type Request, type Response } from "express";
import httpStatus from "http-status";
import { ApiError } from "./error";

export async function getVerifyDevice(req: Request, res: Response, next: NextFunction) {
  try {
    const userAgent = req.useragent!;

    if (
      userAgent.isMobile ||
      userAgent.isMobileNative ||
      userAgent.isTablet ||
      userAgent.isiPad ||
      userAgent.isiPod ||
      userAgent.isiPhone ||
      userAgent.isAndroid ||
      userAgent.isAndroidTablet ||
      userAgent.isBlackberry
    ) {
      throw new ApiError(httpStatus.FORBIDDEN, "Access denied. Please use a desktop client.");
    }

    next();
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      message: e.message ?? "Internal server error",
    });
  }
}
