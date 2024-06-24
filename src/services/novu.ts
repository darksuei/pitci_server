import { readEnv } from "../config/readEnv.config";
import { Novu } from "@novu/node";
import { NovuTriggersEnum } from "../utils/enums";

export class NovuService {
  private static instance: NovuService | null = null;
  private readonly novu: Novu;

  private constructor(private readonly apiKey: string) {
    this.novu = new Novu(apiKey);
  }

  static getInstance(): NovuService {
    if (!NovuService.instance) {
      NovuService.instance = new NovuService(readEnv("NOVU_API_KEY") as string);
    }
    return NovuService.instance;
  }

  async createSubscriber({ id, email }: { id: string; email?: string }) {
    await NovuService.getInstance().novu.subscribers.identify(id, {
      email,
    });
  }

  async updateSubscriberPhone({ id, phone }: { id: string; phone?: string }) {
    await NovuService.getInstance().novu.subscribers.update(id, {
      phone,
    });
  }

  async sendEmailVerificationNotification({
    id,
    name,
    verificationCode,
  }: {
    id: string;
    name: string;
    verificationCode: string;
  }) {
    await NovuService.getInstance().novu.trigger(NovuTriggersEnum.EMAIL_VERIFICATION, {
      to: {
        subscriberId: id,
      },
      payload: {
        name,
        verificationCode,
      },
    });
  }

  async sendForgotPasswordEmail({
    id,
    name,
    verificationCode,
  }: {
    id: string;
    name: string;
    verificationCode: string;
  }) {
    await NovuService.getInstance().novu.trigger(NovuTriggersEnum.FORGOT_PASSWORD, {
      to: {
        subscriberId: id,
      },
      payload: {
        name,
        verificationCode,
      },
    });
  }

  async sendPhoneNumberVerificationOtp({ id, verificationCode }: { id: string; verificationCode: string }) {
    await NovuService.getInstance().novu.trigger(NovuTriggersEnum.PHONE_VERIFICATION, {
      to: {
        subscriberId: id,
      },
      payload: {
        verificationCode,
      },
    });
  }
}
