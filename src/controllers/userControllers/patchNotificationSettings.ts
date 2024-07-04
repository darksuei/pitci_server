import { Request, Response } from "express";
import httpStatus from "http-status";
import { PatchNotificationSettingsValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AppDataSource } from "../../database/dataSource";

export async function patchNotificationSettings(req: Request, res: Response) {
  try {
    validateRequest(PatchNotificationSettingsValidationSchema, req.body);

    const { notificationStatus, pitchNotificationStatus, postNotificationStatus, eventNotificationStatus } =
      req.body as z.infer<typeof PatchNotificationSettingsValidationSchema>;

    const user = req.user!;

    notificationStatus !== undefined && (user.notification_status = notificationStatus);
    pitchNotificationStatus !== undefined && (user.pitch_notification_status = pitchNotificationStatus);
    postNotificationStatus !== undefined && (user.post_notification_status = postNotificationStatus);
    eventNotificationStatus !== undefined && (user.event_notification_status = eventNotificationStatus);

    await AppDataSource.manager.save(user);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Notification settings updated successfully",
    });
  } catch (e: any) {
    return res.status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: e.message ?? "Internal Server Error",
    });
  }
}
