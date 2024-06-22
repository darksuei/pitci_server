import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../database/dataSource";
import { UserEntity } from "../entity/UserEntity";
import { ApiError } from "../middlewares/error";
import httpStatus from "http-status";
import { validateExpiryTime } from "../validators";
import { AuthEntity } from "../entity/AuthEntity";
import { VerificationStatusEnum } from "../utils/enums";
import { generateVerificationCode } from "../utils";

class AuthService {
  private readonly AuthEntity = AuthEntity;
  private readonly AppDataSource = AppDataSource;

  public async initAuth(user: UserEntity) {
    let entity = await this.AppDataSource.manager.findOneBy(this.AuthEntity, { user: { id: user.id } });

    if (!entity) {
      entity = new this.AuthEntity();
      entity.user = user;
    }

    entity.verificationCode = generateVerificationCode();
    entity.verificationStatus = VerificationStatusEnum.PENDING;
    entity.verificationTimeStamp = new Date();

    return await this.AppDataSource.manager.save(entity);
  }

  public async initAuthWithoutVerification(user: UserEntity) {
    let entity = await this.AppDataSource.manager.findOneBy(this.AuthEntity, { user: { id: user.id } });

    if (!entity) {
      entity = new this.AuthEntity();
      entity.user = user;
    }

    entity.sessionId = uuidv4();
    entity.verificationCode = "";
    entity.verificationStatus = VerificationStatusEnum.VERIFIED;
    entity.verificationTimeStamp = new Date();

    return await this.AppDataSource.manager.save(entity);
  }

  public async completeAuth(user: UserEntity) {
    let entity = await this.AppDataSource.manager.findOneBy(this.AuthEntity, { user: { id: user.id } });

    if (!entity) throw new Error("Authentication entity not found");

    entity.sessionId = uuidv4();
    entity.verificationCode = "";
    entity.verificationStatus = VerificationStatusEnum.VERIFIED;
    entity.verificationTimeStamp = new Date();

    return await this.AppDataSource.manager.save(entity);
  }
  public async validateAuth(sessionId: string, user: UserEntity) {
    let entity = await this.AppDataSource.manager.findOneBy(this.AuthEntity, { user: { id: user.id } });

    if (!entity) throw new Error("Authentication entity not found");

    if (entity.verificationStatus !== VerificationStatusEnum.VERIFIED) throw new Error("User not verified");

    if (entity.sessionId !== sessionId) throw new Error("Invalid session id.");
  }

  public async validatePendingVerificationStatus(user: UserEntity, verificationCode: string) {
    let entity = await this.AppDataSource.manager.findOneBy(this.AuthEntity, { user: { id: user.id } });

    if (!entity) throw new Error("Authentication entity not found");

    if (entity.verificationStatus === VerificationStatusEnum.VERIFIED)
      throw new ApiError(httpStatus.BAD_REQUEST, "User already verified");

    if (entity.verificationCode !== verificationCode)
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid verification code");

    validateExpiryTime(entity.verificationTimeStamp!.getTime());
  }
}

export default new AuthService();
