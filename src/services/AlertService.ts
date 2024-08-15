import logger from "../config/logger.config";
import { AppDataSource } from "../database/dataSource";
import { AlertEntity } from "../entity/AlertEntity";
import { EventEntity } from "../entity/EventEntity";
import { PitchEntity } from "../entity/PitchEntity";
import { UserEntity } from "../entity/UserEntity";

class AlertService {
  private alerts = new Map<string, string>([
    ["newEvent", "New Event"],
    ["pitchApproved", "Pitch Approved"],
    ["pitchRejected", "Pitch Rejected"],
    ["phoneNumberChanged", "Phone Number Changed"],
    ["passwordChanged", "Password Changed"],
    ["awardNomination", "Award Nomination"],
  ]);

  getAlertMessage(alertType: typeof this.alerts extends Map<infer K, any> ? K : never, main?: string) {
    switch (alertType) {
      case "newEvent":
        return `A new event - '${main}' is now available!`;
      case "pitchApproved":
        return `Your pitch: #${main} has been approved!`;
      case "pitchRejected":
        return `Your pitch: #${main} has been rejected!`;
      case "phoneNumberChanged":
        return `Your phone number has successfully been updated!`;
      case "passwordChanged":
        return `Your account password has successfully been updated!`;
      case "awardNomination":
        return `You have been nominated for the award - ${main}!`;
      default:
        return "";
    }
  }

  async newEvent(event: EventEntity) {
    const users = await AppDataSource.manager.find(UserEntity, {
      where: { event_notification_status: true },
    });

    if (users.length < 1) return;

    for (const user of users) {
      const alert = new AlertEntity();
      alert.userId = user.id;
      alert.title = this.alerts.get("newEvent")!;
      alert.message = this.getAlertMessage("newEvent", event.title);
      await AppDataSource.manager.save(alert);
    }

    logger.info("Completed new event alert workflow.");
  }

  async userPitchApproved(userId: string, pitchId: string) {
    const pitch = await AppDataSource.manager.findOne(PitchEntity, {
      where: { id: pitchId, user: { id: userId } },
      relations: ["user"],
    });

    if (!pitch || !pitch.user.pitch_notification_status) return;

    const alert = new AlertEntity();
    alert.userId = userId;
    alert.title = this.alerts.get("pitchApproved")!;
    alert.message = this.getAlertMessage("pitchApproved", pitch.uid || pitch.id.split("-")[0]);
    await AppDataSource.manager.save(alert);
  }

  async userPitchRejected(userId: string, pitchId: string) {
    const pitch = await AppDataSource.manager.findOne(PitchEntity, {
      where: { id: pitchId, user: { id: userId } },
    });

    if (!pitch || !pitch.user.pitch_notification_status) return;

    const alert = new AlertEntity();
    alert.userId = userId;
    alert.title = this.alerts.get("pitchRejected")!;
    alert.message = this.getAlertMessage("pitchRejected", pitch.uid || pitch.id.split("-")[0]);
    await AppDataSource.manager.save(alert);
  }

  async userPhoneNumberChanged(userId: string, isNotificationEnabled: boolean) {
    if (!isNotificationEnabled) return;

    const alert = new AlertEntity();
    alert.userId = userId;
    alert.title = this.alerts.get("phoneNumberChanged")!;
    alert.message = this.getAlertMessage("phoneNumberChanged");
    await AppDataSource.manager.save(alert);
  }

  async userPasswordChanged(userId: string, isNotificationEnabled: boolean) {
    if (!isNotificationEnabled) return;

    const alert = new AlertEntity();
    alert.userId = userId;
    alert.title = this.alerts.get("passwordChanged")!;
    alert.message = this.getAlertMessage("passwordChanged");
    await AppDataSource.manager.save(alert);
  }

  async awardNomination(userId: string, awardName: string, isNotificationEnabled: boolean) {
    if (!isNotificationEnabled) return;

    const alert = new AlertEntity();
    alert.userId = userId;
    alert.title = this.alerts.get("awardNomination")!;
    alert.message = this.getAlertMessage("awardNomination", awardName);
    await AppDataSource.manager.save(alert);
  }
}

export default new AlertService();
