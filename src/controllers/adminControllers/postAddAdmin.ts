import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostAddAdminValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";
import { RoleEnum } from "../../utils/enums";
import { ApiError } from "../../middlewares/error";

export async function postAddAdmin(req: Request, res: Response) {
  try {
    validateRequest(PostAddAdminValidationSchema, req.body);

    const { email } = req.body as z.infer<typeof PostAddAdminValidationSchema>;

    const user = await AppDataSource.manager.findOne(UserEntity, {
      where: {
        email: email,
      },
    });

    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User with this email does not exist.");

    if (user.role === RoleEnum.ADMIN || user.role === RoleEnum.SUPER_ADMIN)
      throw new ApiError(httpStatus.BAD_REQUEST, "User is already an admin.");

    user.role = RoleEnum.ADMIN;

    await AppDataSource.manager.save(user);

    // We should probably send like an email to the admin to notify them..

    return res.status(httpStatus.OK).json({ message: "User added as admin successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
