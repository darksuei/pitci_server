import express from "express";
import { postRegister } from "../controllers/authControllers/postRegister";
import { postLogin } from "../controllers/authControllers/postLogin";
import { postVerifyCode } from "../controllers/authControllers/postVerifyCode";

const router = express.Router();

router.route("/register").post(postRegister);

router.route("/login").post(postLogin);

router.route("/verify-code").post(postVerifyCode);

export default router;
