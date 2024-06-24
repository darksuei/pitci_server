import express from "express";
import { getUser } from "../controllers/userControllers/getUser";
import { authenticate } from "../middlewares/authenticate";
import { postRequestForgotPasswordEmail } from "../controllers/userControllers/changePassword/postRequestForgotPasswordEmail";
import { postVerifyForgotPasswordCode } from "../controllers/userControllers/changePassword/postVerifyForgotPasswordCode";
import { patchUserPassword } from "../controllers/userControllers/changePassword/patchUserPassword";
import { postRequestPhoneNumberChange } from "../controllers/userControllers/addPhoneNumber/postRequestPhoneNumberChange";
import { patchPhoneNumber } from "../controllers/userControllers/addPhoneNumber/patchPhoneNumber";

const router = express.Router();

router.route("/").get(authenticate, getUser);

router.route("/password/request-forgot-password-email").post(authenticate, postRequestForgotPasswordEmail);

router.route("/password/verify-forgot-password-code").post(authenticate, postVerifyForgotPasswordCode);

router.route("/password/update-user-password").patch(authenticate, patchUserPassword);

router.route("/phone/request-phone-otp").post(authenticate, postRequestPhoneNumberChange);

router.route("/phone/update-user-phone").patch(authenticate, patchPhoneNumber);

export default router;
