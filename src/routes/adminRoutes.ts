import express from "express";
import { getMetrics } from "../controllers/adminControllers/getMetrics";
import { authenticate } from "../middlewares/authenticate";
import { requireDesktopClient } from "../middlewares/requireDesktopClient";
import { authorization } from "../middlewares/authorization";
import { RoleEnum } from "../utils/enums";
import { getUsers } from "../controllers/adminControllers/getUsers";
import { getUser } from "../controllers/userControllers/getUser";
import { getBusinesses } from "../controllers/adminControllers/getBusinesses";
import { getPitches } from "../controllers/adminControllers/getPitches";
import { patchReviewPitch } from "../controllers/adminControllers/patchReviewPitch";

const router = express.Router();

router
  .route("/get-metrics")
  .get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getMetrics);

router.route("/get-user").get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getUser);

router.route("/get-users").get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getUsers);

router
  .route("/get-businesses")
  .get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getBusinesses);

router
  .route("/get-pitches")
  .get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getPitches);

router
  .route("/review-pitch")
  .patch(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), patchReviewPitch);
