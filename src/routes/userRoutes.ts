import express from "express";
import { getUser } from "../controllers/userControllers/getUser";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.route("/").get(authenticate, getUser);

export default router;
