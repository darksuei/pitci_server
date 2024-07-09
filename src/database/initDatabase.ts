import { AppDataSource } from "./dataSource";
import logger from "../config/logger.config";
import { seedSuperAdmin } from "./seeder";

export const initializeDatabase = async (): Promise<void> => {
  logger.info("Connecting to database...");

  await AppDataSource.initialize()
    .then(async () => {
      logger.info("Database connection success...");
      await seedSuperAdmin(AppDataSource);
    })
    .catch((error) => {
      throw error;
    });
};
