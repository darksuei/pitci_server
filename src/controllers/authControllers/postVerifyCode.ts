import * as z from "zod";
import { Request, Response } from "express";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";
import { VerifyCodeValidationSchema, validateRequest } from "../../validators";
import { ApiError } from "../../middlewares/error";
import httpStatus from "http-status";
import AuthService from "../../services/AuthService";
import { signToken } from "../../utils";

export async function postVerifyCode(req: Request, res: Response) {
  try {
    validateRequest(VerifyCodeValidationSchema, req.body);

    const { email, code } = req.body as z.infer<typeof VerifyCodeValidationSchema>;

    const user = await AppDataSource.manager.findOne(UserEntity, {
      where: { email },
    });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    await AuthService.validatePendingVerificationStatus(user, code);

    const auth = await AuthService.completeAuth(user);

    const token = signToken({
      id: user.id,
      email: user.email,
      sessionId: auth.sessionId,
    });

    return res.json({ success: true, message: "Verification successful", token });
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal server error",
    });
  }
}
