import express from "express";
import { postCreateSuperAdmin } from "../controllers/internalControllers/postCreateSuperAdmin";

const router = express.Router();

router.post("/create-super-admin", postCreateSuperAdmin); // Needs serious authentication

export default router;
