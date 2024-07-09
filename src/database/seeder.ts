import { DataSource } from "typeorm";
import { UserEntity } from "../entity/UserEntity";
import { readEnv } from "../config/readEnv.config";
import { RoleEnum } from "../utils/enums";
import AuthService from "../services/AuthService";
import { NovuService } from "../services/novu";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/constants";
import logger from "../config/logger.config";

export async function seedSuperAdmin(AppDataSource: DataSource) {
  try {
    const existingSuperAdmin = await AppDataSource.manager.findOne(UserEntity, {
      where: { role: RoleEnum.SUPER_ADMIN },
    });

    if (existingSuperAdmin) {
      logger.info("Super admin user already exists.. Skipping seeding..");
      return;
    }

    let admin = new UserEntity();

    admin.full_name = readEnv("SUPER_ADMIN_NAME") as string;
    admin.email = readEnv("SUPER_ADMIN_EMAIL") as string;
    admin.phone = readEnv("SUPER_ADMIN_PHONE") as string;
    admin.password = await bcrypt.hash(readEnv("SUPER_ADMIN_PASSWORD") as string, SALT_ROUNDS);
    admin.role = RoleEnum.SUPER_ADMIN;
    admin.notification_status = true;

    admin = await AppDataSource.manager.save(admin);

    const auth = await AuthService.initAuthWithoutVerification(admin);

    admin.auth = auth;

    await AppDataSource.manager.save(admin);

    await NovuService.getInstance().createSubscriber({ id: admin.id, email: admin.email });

    logger.info("Super admin user seeded successfully..");
  } catch (e) {
    console.log(e);
    logger.error("Failed to create super admin user.");
  }
}
