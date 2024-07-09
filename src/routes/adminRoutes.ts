import express from "express";
import { getMetrics } from "../controllers/adminControllers/getMetrics";
import { authenticate } from "../middlewares/authenticate";
import { requireDesktopClient } from "../middlewares/requireDesktopClient";
import { authorization } from "../middlewares/authorization";
import { RoleEnum } from "../utils/enums";
import { getUsers } from "../controllers/adminControllers/getUsers";
import { getUser } from "../controllers/userControllers/getUser";
import { getBusinesses } from "../controllers/adminControllers/getBusinesses";
import { getPitches } from "../controllers/adminControllers/getPitches";
import { patchReviewPitch } from "../controllers/adminControllers/patchReviewPitch";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/get-metrics:
 *   get:
 *     summary: Get system metrics
 *     tags:
 *      - admin
 *     description: Retrieves a list of all metrics in the system.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPitches:
 *                   type: number
 *                   example: 10
 *                 totalUsers:
 *                   type: number
 *                   example: 10
 *                 totalBusinesses:
 *                   type: number
 *                   example: 10
 *                 pendingReviews:
 *                   type: number
 *                   example: 10
 *                 approvedPitches:
 *                   type: number
 *                   example: 10
 *                 declinedPitches:
 *                   type: number
 *                   example: 10
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router
  .route("/get-metrics")
  .get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getMetrics);

/**
 * @openapi
 * /api/v1/admin/get-user:
 *   get:
 *     tags:
 *      - admin
 *     summary: Get currently logged-in admin information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/get-user").get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getUser);

/**
 * @swagger
 * /api/v1/admin/get-users:
 *   get:
 *     summary: Get all users
 *     tags:
 *      - admin
 *     description: Retrieves a list of all users in the system.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.route("/get-users").get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getUsers);

/**
 * @swagger
 * /api/v1/admin/get-businesses:
 *   get:
 *     summary: Get all businesses
 *     tags:
 *      - admin
 *     description: Retrieves a list of all businesses in the system.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router
  .route("/get-businesses")
  .get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getBusinesses);

/**
 * @swagger
 * /api/v1/admin/get-pitches:
 *   get:
 *     summary: Get all pitches
 *     tags:
 *      - admin
 *     description: Retrieves a list of all pitches in the system.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router
  .route("/get-pitches")
  .get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getPitches);

/**
 * @swagger
 * /api/v1/admin/review-pitch:
 *   patch:
 *     summary: Patch review status for a pitch
 *     tags:
 *      - admin
 *     description: Updates the review status for a specific pitch. Only authorized reviewers can patch the review status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pitchId
 *         in: path
 *         required: true
 *         description: The id of the pitch
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchReviewPitchValidationSchema'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad Request (Validation Error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the validation failure
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating unauthorized access
 *       404:
 *         description: Not Found (Pitch not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the pitch with the provided ID was not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating an unexpected internal server error
 */
router
  .route("/review-pitch")
  .patch(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), patchReviewPitch);

export default router;
