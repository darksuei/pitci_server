import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostVerifyForgotPasswordCodeValidationSchema, validateRequest } from "../../validators";

export async function postVerifyForgotPasswordCode(req: Request, res: Response) {
  try {
    validateRequest(PostVerifyForgotPasswordCodeValidationSchema, req.body);

    const { verificationCode } = req.body;

    if (verificationCode !== req.user!.forgot_password_code)
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid verification code" });

    return res.status(httpStatus.OK).json({ success: true, message: "Verification code is valid" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
