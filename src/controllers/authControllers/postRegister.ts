import { type Request, type Response } from "express";
import * as zod from "zod";
import { UserEntity } from "../../entity/UserEntity";
import { AppDataSource } from "../../database/dataSource";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { SALT_ROUNDS } from "../../utils/constants";
import { RegisterSchema, validateRequest } from "../../validators";
import AuthService from "../../services/AuthService";
import { ApiError } from "../../middlewares/error";
import { NovuService } from "../../services/novu";

export async function postRegister(req: Request, res: Response) {
  try {
    validateRequest(RegisterSchema, req.body);

    const { email, fullName, password } = req.body as zod.infer<typeof RegisterSchema>;

    const existingUser = await AppDataSource.manager.findOne(UserEntity, {
      where: { email },
    });

    if (existingUser) throw new ApiError(httpStatus.CONFLICT, "User already exists.");

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    let user = new UserEntity();
    user.email = email;
    user.full_name = fullName;
    user.password = passwordHash;
    user = await AppDataSource.manager.save(user);

    const auth = await AuthService.initAuth(user);

    await NovuService.getInstance().createSubscriber({ id: user.id, email: user.email });

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
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message ?? "Internal Server Error" });
  }
}
