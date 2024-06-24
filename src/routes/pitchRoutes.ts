import express from "express";
import { postInitiatePitch } from "../controllers/pitchControllers/postInitiatePitch";
import { authenticate } from "../middlewares/authenticate";
import { patchPitch } from "../controllers/pitchControllers/patchPitch";
import { getPitch } from "../controllers/pitchControllers/getPitch";

const router = express.Router();

router.route("/get-pitch").get(authenticate, getPitch);

router.route("/initiate-pitch").post(authenticate, postInitiatePitch);

router.route("/update-pitch").patch(authenticate, patchPitch);

export default router;
