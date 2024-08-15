import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../database/dataSource";
import { UserEntity } from "../../entity/UserEntity";
import { RoleEnum } from "../../utils/enums";
import { ApiError } from "../../middlewares/error";

export async function patchRevokeAdminStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const admin = await AppDataSource.manager.findOne(UserEntity, {
      where: {
        id: id,
        role: RoleEnum.ADMIN,
      },
    });

    if (!admin) throw new ApiError(httpStatus.NOT_FOUND, "Admin not found.");

    admin.role = RoleEnum.USER;

    await AppDataSource.manager.save(admin);

    return res.status(httpStatus.OK).json({ message: "Admin status revoked successfully" });
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal Server Error",
    });
  }
}
