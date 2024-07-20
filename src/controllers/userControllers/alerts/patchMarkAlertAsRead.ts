import { Request, Response } from "express";
import httpStatus from "http-status";
import * as z from "zod";
import { AppDataSource } from "../../../database/dataSource";
import { AlertEntity } from "../../../entity/AlertEntity";
import { PatchMarkAlertAsReadValidationSchema, validateRequest } from "../../../validators";

export async function patchMarkAlertAsRead(req: Request, res: Response) {
  try {
    validateRequest(PatchMarkAlertAsReadValidationSchema, req.body, () => {
      if (!req.body.markAllAsRead && (!req.body.alertIds || req.body.alertIds.length === 0)) {
        throw new Error("Please provide either 'markAllAsRead' as true or a non-empty list of 'alertIds'.");
      }
    });

    const { alertIds, markAllAsRead } = req.body as z.infer<typeof PatchMarkAlertAsReadValidationSchema>;

    if (markAllAsRead) {
      await AppDataSource.manager.update(AlertEntity, { userId: req.user!.id }, { is_read: true });
    } else if (alertIds && alertIds.length > 0) {
      alertIds.forEach(async (alertId: string) => {
        await AppDataSource.manager.update(AlertEntity, { id: alertId }, { is_read: true });
      });
    }

    return res.status(httpStatus.OK).json({ message: "Alerts marked as read." });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
