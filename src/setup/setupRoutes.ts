import { Application } from "express";
import healthCheckRoute from "../routes/healthCheckRoute";
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";
import pitchRoutes from "../routes/pitchRoutes";
import adminRoutes from "../routes/adminRoutes";
import internalRoutes from "../routes/internalRoutes";
import eventRoutes from "../routes/eventRoutes";

export default function setupRoutes(app: Application): void {
  app.use("/api/v1/health", healthCheckRoute);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/pitch", pitchRoutes);
  app.use("/api/v1/admin", adminRoutes);
  app.use("/api/v1/event", eventRoutes);
  app.use("/api/v1/internal", internalRoutes);
}
