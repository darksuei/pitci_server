import { Request, Response } from "express";
import httpStatus from "http-status";
import { DeleteUserAccountSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";
import { ApiError } from "../../middlewares/error";
import bcrypt from "bcrypt";
import { RoleEnum } from "../../utils/enums";

export async function deleteUserAccount(req: Request, res: Response) {
  try {
    validateRequest(DeleteUserAccountSchema, req.body);

    const { email, password } = req.body as z.infer<typeof DeleteUserAccountSchema>;

    const user = await AppDataSource.manager.findOne(UserEntity, {
      where: { email },
    });

    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    if (user.role === RoleEnum.SUPER_ADMIN)
      throw new ApiError(httpStatus.BAD_REQUEST, "Super Admin account cannot be deleted.");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid password.");

    await AppDataSource.manager.remove(user);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "User account deleted successfully.",
    });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
