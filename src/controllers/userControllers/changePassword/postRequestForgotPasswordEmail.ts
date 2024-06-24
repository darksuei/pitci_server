import { Request, Response } from "express";
import httpStatus from "http-status";
import * as z from "zod";
import { ApiError } from "../../../middlewares/error";
import { AppDataSource } from "../../../database/dataSource";
import { generateVerificationCode } from "../../../utils";
import { NovuService } from "../../../services/novu";
import { PostRequestForgotPasswordEmailSchema, validateRequest } from "../../../validators";

export async function postRequestForgotPasswordEmail(req: Request, res: Response) {
  try {
    const user = req.user!;

    validateRequest(PostRequestForgotPasswordEmailSchema, req.body);

    const { email } = req.body as z.infer<typeof PostRequestForgotPasswordEmailSchema>;

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
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
