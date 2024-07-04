import express from "express";
import { postRegister } from "../controllers/authControllers/postRegister";
import { postLogin } from "../controllers/authControllers/postLogin";
import { postVerifyCode } from "../controllers/authControllers/postVerifyCode";
import { getResendEmailVerificationCode } from "../controllers/authControllers/getResendEmailVerificationCode";

const router = express.Router();

router.route("/register").post(postRegister);

router.route("/login").post(postLogin);

router.route("/verify-code").post(postVerifyCode);

router.route("/resend-email-verification-code").get(getResendEmailVerificationCode);

export default router;
