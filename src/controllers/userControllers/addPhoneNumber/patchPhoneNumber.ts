import { Request, Response } from "express";
import { PatchPhoneNumberValidationSchema, validateRequest } from "../../../validators";
import { AppDataSource } from "../../../database/dataSource";
import httpStatus from "http-status";
import * as z from "zod";

export async function patchPhoneNumber(req: Request, res: Response) {
  try {
    const user = req.user!;

    validateRequest(PatchPhoneNumberValidationSchema, req.body);

    const { phoneNumber, verificationCode } = req.body as z.infer<typeof PatchPhoneNumberValidationSchema>;

    if (verificationCode !== req.user!.phone_verification_code)
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid verification code" });

    user.phone = phoneNumber;

    await AppDataSource.manager.save(user);

    return res.status(httpStatus.OK).json({ success: true, message: "Phone number updated successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
