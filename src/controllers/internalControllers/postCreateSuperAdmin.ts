import httpStatus from "http-status";
import { type Request, type Response } from "express";
import * as zod from "zod";
import { RegisterSchema, validateRequest } from "../../validators";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";
import { ApiError } from "../../middlewares/error";
import { SALT_ROUNDS } from "../../utils/constants";
import bcrypt from "bcrypt";
import { RoleEnum } from "../../utils/enums";
import AuthService from "../../services/AuthService";
import { NovuService } from "../../services/novu";

export async function postCreateSuperAdmin(req: Request, res: Response) {
  try {
    validateRequest(RegisterSchema, req.body);

    const { email, fullName, password, phone } = req.body as zod.infer<typeof RegisterSchema>;

    const existingUser = await AppDataSource.manager.findOne(UserEntity, {
      where: { email },
    });

    if (existingUser) throw new ApiError(httpStatus.CONFLICT, "User already exists.");

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    let admin = new UserEntity();

    admin.email = email;
    admin.full_name = fullName;
    phone && (admin.phone = phone);
    admin.password = passwordHash;
    admin.role = RoleEnum.SUPER_ADMIN;
    admin.notification_status = true;

    admin = await AppDataSource.manager.save(admin);

    const auth = await AuthService.initAuthWithoutVerification(admin);

    admin.auth = auth;

    admin = await AppDataSource.manager.save(admin);

    await NovuService.getInstance().createSubscriber({ id: admin.id, email: email });

    return res.status(httpStatus.OK).json({ message: "Super admin created successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: e.message ?? "Internal Server Error" });
  }
}
