import { Request, Response } from "express";
import httpStatus from "http-status";
import { GetResendVerificationCodeValidationSchema, validateRequest } from "../../../validators";
import * as z from "zod";
import { AppDataSource } from "../../../database/dataSource";
import { ApiError } from "../../../middlewares/error";
import { NovuService } from "../../../services/novu";
import { generateVerificationCode } from "../../../utils";

export async function getResendForgotPasswordEmail(req: Request, res: Response) {
  try {
    const user = req.user!;

    validateRequest(GetResendVerificationCodeValidationSchema, req.query);

    const { email } = req.query as z.infer<typeof GetResendVerificationCodeValidationSchema>;

    if (email !== req.user!.email) throw new ApiError(httpStatus.FORBIDDEN, "Invalid email");

    const verificationCode = generateVerificationCode();

    await NovuService.getInstance().sendForgotPasswordEmail({
      id: req.user!.id,
      name: req.user!.full_name,
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
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal Server Error",
    });
  }
}
