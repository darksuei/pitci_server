import { Application } from "express";
import healthCheckRoute from "../routes/healthCheckRoute";
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";

export default function setupRoutes(app: Application): void {
  app.use("/api/v1/health", healthCheckRoute);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/user", userRoutes);
}
