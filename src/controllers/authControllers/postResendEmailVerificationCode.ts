import { Request, Response } from "express";
import httpStatus from "http-status";
import { GetResendVerificationCodeValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import AuthService from "../../services/AuthService";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";
import { ApiError } from "../../middlewares/error";
import { NovuService } from "../../services/novu";
import { VerificationStatusEnum } from "../../utils/enums";

export async function postResendEmailVerificationCode(req: Request, res: Response) {
  try {
    validateRequest(GetResendVerificationCodeValidationSchema, req.body);

    const { email } = req.body as z.infer<typeof GetResendVerificationCodeValidationSchema>;

    const user = await AppDataSource.manager.findOne(UserEntity, {
      where: { email },
      relations: ["auth"],
    });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    if (user.auth.verificationStatus === VerificationStatusEnum.VERIFIED)
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already verified. Please login to continue.");

    const auth = await AuthService.initAuth(user);

    await NovuService.getInstance().sendEmailVerificationNotification({
      id: user.id,
      name: user.full_name,
      verificationCode: auth.verificationCode,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      message: `Verification code sent to ${email}`,
      code: auth.verificationCode,
    });
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal Server Error",
    });
  }
}
