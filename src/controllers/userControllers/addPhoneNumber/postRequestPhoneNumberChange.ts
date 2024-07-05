import { Request, Response } from "express";
import { PostRequestPhoneNumberChangeValidationSchema, validateRequest } from "../../../validators";
import * as z from "zod";
import { AppDataSource } from "../../../database/dataSource";
import httpStatus from "http-status";
import { UserEntity } from "../../../entity/UserEntity";
import { ApiError } from "../../../middlewares/error";
import { NovuService } from "../../../services/novu";
import { generateVerificationCode } from "../../../utils";

export async function postRequestPhoneNumberChange(req: Request, res: Response) {
  try {
    const user = req.user!;

    validateRequest(PostRequestPhoneNumberChangeValidationSchema, req.body);

    const { phoneNumber } = req.body as z.infer<typeof PostRequestPhoneNumberChangeValidationSchema>;

    const existingPhoneNumber = await AppDataSource.manager.findOne(UserEntity, {
      where: { phone: phoneNumber },
    });

    if (existingPhoneNumber) throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already exists");

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
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
