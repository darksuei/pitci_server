import express from "express";
import { getUser } from "../controllers/userControllers/getUser";
import { authenticate } from "../middlewares/authenticate";
import { postRequestForgotPasswordEmail } from "../controllers/userControllers/postRequestForgotPasswordEmail";
import { postVerifyForgotPasswordCode } from "../controllers/userControllers/postVerifyForgotPasswordCode";
import { patchUserPassword } from "../controllers/userControllers/patchUserPassword";

const router = express.Router();

router.route("/").get(authenticate, getUser);

router.route("/request-forgot-password-email").post(authenticate, postRequestForgotPasswordEmail);

router.route("/verify-forgot-password-code").post(authenticate, postVerifyForgotPasswordCode);

router.route("/update-user-password").patch(authenticate, patchUserPassword);

export default router;
