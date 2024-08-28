import express from "express";
import { postCreateSuperAdmin } from "../controllers/internalControllers/postCreateSuperAdmin";
import { authorization } from "../middlewares/authorization";
import { RoleEnum } from "../utils/enums";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post("/create-super-admin", authenticate, authorization(RoleEnum.SUPER_ADMIN), postCreateSuperAdmin);

export default router;
