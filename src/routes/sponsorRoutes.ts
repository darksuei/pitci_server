import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { requireDesktopClient } from "../middlewares/requireDesktopClient";
import { authorization } from "../middlewares/authorization";
import { RoleEnum } from "../utils/enums";
import multer from "multer";
import { postCreateSponsor } from "../controllers/sponsorControllers/postCreateSponsor";
import { getSponsors } from "../controllers/sponsorControllers/getSponsors";
import { deleteSponsor } from "../controllers/sponsorControllers/deleteSponsor";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/v1/sponsor/create-sponsor:
 *   post:
 *     summary: Create a new sponsor (ADMIN ONLY)
 *     description: Creates a new sponsor with the provided details.
 *     tags:
 *       - sponsor
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the event
 *                 example: "Cocacola"
 *               category:
 *                 type: string
 *                 description: The sponsor category. (general, event, award, pitch, business)
 *                 example: "(general, event, award, pitch, business)"
 *               description:
 *                 type: string
 *                 description: The description of the sponsor
 *                 example: "...description..."
 *               website:
 *                 type: string
 *                 description: The sponsor website
 *                 example: "https://example.com"
 *               eventId:
 *                 type: string
 *                 description: The event id of the associated event
 *                 example: "uuid()"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The sponsor logo.
 *     responses:
 *       201:
 *         description: Sponsor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sponsor created successfully"
 *                 sponsor:
 *                   type: object
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router
  .route("/create-sponsor")
  .post(
    authenticate,
    requireDesktopClient,
    authorization(RoleEnum.ADMIN),
    upload.single("image"),
    postCreateSponsor
  );

/**
 * @swagger
 * /api/v1/sponsor/get-all-sponsors:
 *   get:
 *     summary: Retrieve all sponsors
 *     description: Retrieves a list of all sponsors.
 *     tags:
 *       - sponsor
 *     responses:
 *       200:
 *         description: A list of sponsors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *                   website:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.route("/get-all-sponsors").get(getSponsors);

/**
 * @swagger
 * /api/v1/sponsor/delete-sponsor/{id}:
 *   delete:
 *     summary: Delete an sponsor (ADMIN ONLY)
 *     description: Deletes an sponsor by its ID.
 *     tags:
 *       - sponsor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the sponsor to delete
 *     responses:
 *       200:
 *         description: Sponsor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sponsor deleted successfully"
 *       404:
 *         description: Sponsor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sponsor not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router
  .route("/delete-sponsor/:id")
  .delete(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), deleteSponsor);

export default router;
