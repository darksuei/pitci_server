import express from "express";
import { postInitiatePitch } from "../controllers/pitchControllers/postInitiatePitch";
import { authenticate } from "../middlewares/authenticate";
import { patchPitch } from "../controllers/pitchControllers/patchPitch";
import { getPitch } from "../controllers/pitchControllers/getPitch";
import { getAllPitches } from "../controllers/pitchControllers/getAllPitches";
import { deletePitch } from "../controllers/pitchControllers/deletePitch";
import { postSubmitPitch } from "../controllers/pitchControllers/postSubmitPitch";
import { getUserPitches } from "../controllers/pitchControllers/getUserPitches";

const router = express.Router();

router.route("/get-pitch/:id").get(authenticate, getPitch);

router.route("/get-user-pitch").get(authenticate, getUserPitches);

router.route("/get-all-pitches").get(getAllPitches);

router.route("/initiate-pitch").post(authenticate, postInitiatePitch);

router.route("/update-pitch/:id").patch(authenticate, patchPitch);

router.route("/submit-pitch/:id").post(authenticate, postSubmitPitch);

router.route("/delete-pitch/:id").delete(authenticate, deletePitch);

export default router;
