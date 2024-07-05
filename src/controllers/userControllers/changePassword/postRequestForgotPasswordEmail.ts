import { Request, Response } from "express";
import httpStatus from "http-status";
import * as z from "zod";
import { AppDataSource } from "../../../database/dataSource";
import { generateVerificationCode } from "../../../utils";
import { NovuService } from "../../../services/novu";
import { PostRequestForgotPasswordEmailSchema, validateRequest } from "../../../validators";
import { UserEntity } from "../../../entity/UserEntity";
import { ApiError } from "../../../middlewares/error";

export async function postRequestForgotPasswordEmail(req: Request, res: Response) {
  try {
    validateRequest(PostRequestForgotPasswordEmailSchema, req.body);

    const { email } = req.body as z.infer<typeof PostRequestForgotPasswordEmailSchema>;

    const user = await AppDataSource.manager.findOne(UserEntity, { where: { email: req.body.email } });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    const verificationCode = generateVerificationCode();

    await NovuService.getInstance().sendForgotPasswordEmail({
      id: user.id,
      name: user.full_name,
      verificationCode: verificationCode,
    });

    user.forgot_password_code = verificationCode;

    await AppDataSource.manager.save(user);

    return res.status(httpStatus.OK).json({
      success: true,
      message: `Verification code sent to ${email}`,
      code: verificationCode,
    });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
