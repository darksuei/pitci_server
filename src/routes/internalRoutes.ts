import express from "express";
import { postCreateSuperAdmin } from "../controllers/internalControllers/postCreateSuperAdmin";
import { authorization } from "../middlewares/authorization";
import { RoleEnum } from "../utils/enums";

const router = express.Router();

router.post("/create-super-admin", authorization(RoleEnum.SUPER_ADMIN), postCreateSuperAdmin);

export default router;
