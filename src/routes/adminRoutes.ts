import express from "express";
import { getMetrics } from "../controllers/adminControllers/getMetrics";
import { authenticate } from "../middlewares/authenticate";
import { requireDesktopClient } from "../middlewares/requireDesktopClient";
import { authorization } from "../middlewares/authorization";
import { RoleEnum } from "../utils/enums";
import { getUsers } from "../controllers/adminControllers/getUsers";
import { getUser } from "../controllers/userControllers/getUser";
import { getBusinesses } from "../controllers/adminControllers/business/getBusinesses";
import { getPitches } from "../controllers/adminControllers/getPitches";
import { patchReviewPitch } from "../controllers/adminControllers/patchReviewPitch";
import { postAddAdmin } from "../controllers/adminControllers/postAddAdmin";
import { getPitch } from "../controllers/adminControllers/getPitch";
import { postCreateBusiness } from "../controllers/adminControllers/business/postCreateBusiness";
import { patchReviewMeetingSchedule } from "../controllers/adminControllers/patchReviewMeetingSchedule";
import { getAllScheduledMeetings } from "../controllers/adminControllers/getAllScheduledMeetings";
import { deleteBusiness } from "../controllers/adminControllers/business/deleteBusiness";
import { patchRevokeAdminStatus } from "../controllers/adminControllers/patchRevokeAdminStatus";

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
 * @openapi
 * /api/v1/admin/get-pitch/{id}:
 *   get:
 *     summary: Get user pitch details
 *     tags:
 *      - admin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The pitch ID
 *     responses:
 *       200:
 *         description: Pitch details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 pitch:
 *                   type: object
 *       400:
 *         description: Bad Request - Validation Error (likely invalid ID format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request parameters
 *       404:
 *         description: Not Found - Pitch not found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pitch not found
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
router.route("/get-pitch/:id").get(authenticate, getPitch);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pitchId:
 *                 type: string
 *                 description: The id of the pitch
 *                 example: "12345"
 *               reviewStatus:
 *                 type: string
 *                 description: The status to update the pitch to
 *                 example: "approved"
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

/**
 * @swagger
 * /api/v1/admin/add-admin:
 *   post:
 *     summary: Add a new admin
 *     description: Adds a new admin by updating the role of an existing user.
 *     tags:
 *       - admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user to be added as admin
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: User added as admin successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User added as admin successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User with this email does not exist."
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
  .route("/add-admin")
  .post(authenticate, requireDesktopClient, authorization(RoleEnum.SUPER_ADMIN), postAddAdmin);

/**
 * @swagger
 * /api/v1/admin/create-business:
 *   post:
 *     summary: Add a new business
 *     description: Adds a new business to the system.
 *     tags:
 *       - admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *                 description: The name of the business.
 *                 example: "Example Business"
 *               businessDescription:
 *                 type: string
 *                 description: The description of the business.
 *                 example: "Example Business is a ...."
 *               businessOwnerName:
 *                 type: string
 *                 description: The name of the owner of the business.
 *                 example: "Dr. John Doe"
 *               businessOwnerEmail:
 *                 type: string
 *                 description: The email of the owner of the business.
 *                 example: "john@doe.com"
 *               businessOwnerPhone:
 *                 type: string
 *                 description: The phone of the owner of the business.
 *                 example: "+1234567890"
 *               website:
 *                 type: string
 *                 description: The business website.
 *                 example: "https://examplebusiness.com"
 *               logo:
 *                 type: string
 *                 description: The business logo (url/base 64).
 *                 example: "https://example.com/logo.png"
 *     responses:
 *       200:
 *         description: Business created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business created successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Duplicate business name."
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
  .route("/create-business")
  .post(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), postCreateBusiness);

/**
 * @swagger
 * /api/v1/admin/review-meeting-schedule:
 *   patch:
 *     summary: Patch review a meeting schedule
 *     tags:
 *      - admin
 *     description: Updates the review status for a specific meeting schedule. Only authorized admins can patch the review status.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meetingId:
 *                 type: string
 *                 description: The id of the meeting schedule
 *                 example: "12345"
 *               meetingLink:
 *                 type: string
 *                 description: A meeting link where the scheduled meeting would hold
 *                 example: "https://meeting.link"
 *               reviewStatus:
 *                 type: string
 *                 description: The status to update the pitch to
 *                 example: "approved"
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
  .route("/review-meeting-schedule")
  .patch(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), patchReviewMeetingSchedule);

/**
 * @swagger
 * /api/v1/admin/get-all-scheduled-meetings:
 *   get:
 *     summary: Retrieve all scheduled meetings in the system
 *     description: Retrieves a list of all scheduled meetings.
 *     tags:
 *       - admin
 *     responses:
 *       200:
 *         description: A list of meeting schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
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
  .route("/get-all-scheduled-meetings")
  .get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getAllScheduledMeetings);

/**
 * @swagger
 * /api/v1/admin/delete-business/{id}:
 *   delete:
 *     summary: Delete a business
 *     description: Deletes an business by its ID.
 *     tags:
 *       - admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business to delete
 *     responses:
 *       200:
 *         description: Business deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business deleted successfully"
 *       404:
 *         description: Business not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business not found"
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
  .route("/delete-business/:id")
  .delete(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), deleteBusiness);

/**
 * @swagger
 * /api/v1/admin/revoke-admin-status/{id}:
 *   patch:
 *     summary: Revoke an existing admin's status
 *     description: Revokes an existing admin's status by updating the role of an existing user.
 *     tags:
 *       - admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin
 *     responses:
 *       200:
 *         description: Admin status revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin status revoked successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin not found."
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
  .route("/revoke-admin-status/:id")
  .patch(authenticate, requireDesktopClient, authorization(RoleEnum.SUPER_ADMIN), patchRevokeAdminStatus);

export default router;
