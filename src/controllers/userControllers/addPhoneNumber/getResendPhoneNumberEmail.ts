import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostRequestPhoneNumberChangeValidationSchema, validateRequest } from "../../../validators";
import * as z from "zod";
import { AppDataSource } from "../../../database/dataSource";
import { NovuService } from "../../../services/novu";
import { generateVerificationCode } from "../../../utils";

export async function getResendPhoneNumberEmail(req: Request, res: Response) {
  try {
    const user = req.user!;

    validateRequest(PostRequestPhoneNumberChangeValidationSchema, req.query);

    const { phoneNumber } = req.query as z.infer<typeof PostRequestPhoneNumberChangeValidationSchema>;

    const verificationCode = generateVerificationCode();

    user.phone_verification_code = verificationCode;

    await AppDataSource.manager.save(user);

    await NovuService.getInstance().updateSubscriberPhone({ id: user.id, phone: phoneNumber });

    await NovuService.getInstance().sendPhoneNumberVerificationOtp({
      id: user.id,
      verificationCode,
    });

    return res
      .status(httpStatus.OK)
      .json({ success: true, message: `Verification code sent to ${phoneNumber}`, code: verificationCode });
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal Server Error",
    });
  }
}
