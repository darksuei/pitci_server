import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../utils/enums";
import httpStatus from "http-status";

export function authorization(role: RoleEnum) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let isPermitted = false;

    switch (role) {
      case RoleEnum.SUPER_ADMIN:
        isPermitted = requireSuperAdmin(req.user!.role);
        break;
      case RoleEnum.ADMIN:
        isPermitted = requireAdmin(req.user!.role);
        break;
      default:
        break;
    }

    if (!isPermitted) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: "You are not authorized to access this resource" });
    }
    next();
  };
}

function requireSuperAdmin(userRole: RoleEnum) {
  if (userRole === RoleEnum.SUPER_ADMIN) {
    return true;
  }
  return false;
}

function requireAdmin(userRole: RoleEnum) {
  if (userRole === RoleEnum.SUPER_ADMIN || userRole === RoleEnum.ADMIN) {
    return true;
  }
  return false;
}
