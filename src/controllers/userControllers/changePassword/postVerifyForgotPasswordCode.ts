import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostVerifyForgotPasswordCodeValidationSchema, validateRequest } from "../../../validators";
import * as z from "zod";
import { AppDataSource } from "../../../database/dataSource";
import { UserEntity } from "../../../entity/UserEntity";
import { ApiError } from "../../../middlewares/error";

export async function postVerifyForgotPasswordCode(req: Request, res: Response) {
  try {
    validateRequest(PostVerifyForgotPasswordCodeValidationSchema, req.body);

    const { email, verificationCode } = req.body as z.infer<
      typeof PostVerifyForgotPasswordCodeValidationSchema
    >;

    const user = await AppDataSource.manager.findOne(UserEntity, { where: { email } });

    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

    if (verificationCode !== user.forgot_password_code)
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid verification code" });

    return res.status(httpStatus.OK).json({ success: true, message: "Verification code is valid" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
