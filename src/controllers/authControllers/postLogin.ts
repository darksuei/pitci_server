import * as zod from "zod";
import bcrypt from "bcrypt";
import { type Request, type Response } from "express";
import { UserEntity } from "../../entity/UserEntity";
import { AppDataSource } from "../../database/dataSource";
import httpStatus from "http-status";
import AuthService from "../../services/AuthService";
import { ApiError } from "../../middlewares/error";
import { LoginSchema, validateRequest } from "../../validators";
import { signToken } from "../../utils";
import { VerificationStatusEnum } from "../../utils/enums";

export async function postLogin(req: Request, res: Response) {
  try {
    validateRequest(LoginSchema, req.body);

    const { email, password } = req.body as zod.infer<typeof LoginSchema>;

    const user = await AppDataSource.manager.findOne(UserEntity, {
      where: { email },
      relations: ["auth"],
    });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found.");

    if (user.auth.verificationStatus !== VerificationStatusEnum.VERIFIED)
      throw new ApiError(httpStatus.BAD_REQUEST, "Email not verified. Please verify your email.");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid password.");

    const auth = await AuthService.initAuthWithoutVerification(user);

    const token = signToken({
      id: user.id,
      email: user.email,
      sessionId: auth.sessionId,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message ?? "Internal Server Error" });
  }
}
