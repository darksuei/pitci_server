import httpStatus from "http-status";
import { Request, Response } from "express";
import { ParamIdValidationSchema, validateRequest } from "../../../validators";
import { AppDataSource } from "../../../database/dataSource";
import { ApiError } from "../../../middlewares/error";
import * as z from "zod";
import { BusinessEntity } from "../../../entity/BusinessEntity";

export async function deleteBusiness(req: Request, res: Response) {
  try {
    validateRequest(ParamIdValidationSchema, req.params);

    const { id } = req.body as z.infer<typeof ParamIdValidationSchema>;

    const business = await AppDataSource.manager.findOne(BusinessEntity, {
      where: {
        id,
      },
    });

    if (!business) throw new ApiError(httpStatus.NOT_FOUND, "Business not found");

    await AppDataSource.manager.remove(business);

    return res.status(httpStatus.OK).json({ message: "Business deleted successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
