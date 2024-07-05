import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import * as z from "zod";
import { SALT_ROUNDS } from "../../../utils/constants";
import { PatchUserPasswordValidationSchema, validateRequest } from "../../../validators";
import { AppDataSource } from "../../../database/dataSource";
import { UserEntity } from "../../../entity/UserEntity";
import { ApiError } from "../../../middlewares/error";

export async function patchUserPassword(req: Request, res: Response) {
  try {
    validateRequest(PatchUserPasswordValidationSchema, req.body);

    const { email, newPassword, verificationCode } = req.body as z.infer<
      typeof PatchUserPasswordValidationSchema
    >;

    const user = await AppDataSource.manager.findOne(UserEntity, { where: { email } });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    if (verificationCode !== user.forgot_password_code)
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid verification code" });

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    user.forgot_password_code = "";

    user.password = passwordHash;

    await AppDataSource.manager.save(user);

    return res.status(httpStatus.OK).json({ success: true, message: "Password updated successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
