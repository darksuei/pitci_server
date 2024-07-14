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
import { postCreateEvent } from "../controllers/adminControllers/events/postCreateEvent";
import { getAllEvents } from "../controllers/adminControllers/events/getAllEvents";
import { deleteEvent } from "../controllers/adminControllers/events/deleteEvent";
import { postAddAdmin } from "../controllers/adminControllers/postAddAdmin";
import { getPitch } from "../controllers/adminControllers/getPitch";

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
 * /api/v1/admin/create-event:
 *   post:
 *     summary: Create a new event
 *     description: Creates a new event with the provided details.
 *     tags:
 *       - admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the event
 *                 example: "Annual Meeting"
 *               description:
 *                 type: string
 *                 description: The description of the event
 *                 example: "This is the annual meeting for all members."
 *               location:
 *                 type: string
 *                 description: The location of the event
 *                 example: "Conference Room A"
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time of the event
 *                 example: "2024-08-15T09:00:00Z"
 *               durationHours:
 *                 type: number
 *                 description: The duration of the event in hours
 *                 example: 3
 *               registrationLink:
 *                 type: string
 *                 description: The registration link for the event
 *                 example: "https://example.com/register"
 *               sponsors:
 *                 type: array
 *                 description: A list of sponsors for the event
 *                 example: [{ name: "Sponsor 1", description: "Description 1" }]
 *               otherLinks:
 *                 type: array
 *                 description: A list of other links for the event
 *                 example: [{ title: "Link1", url: "https://example.com/otherlink" }]
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event created successfully"
 *                 event:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     admin_id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     location:
 *                       type: string
 *                     date_time:
 *                       type: string
 *                       format: date-time
 *                     duration_hours:
 *                       type: number
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
  .route("/create-event")
  .post(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), postCreateEvent);

/**
 * @swagger
 * /api/v1/admin/get-all-events:
 *   get:
 *     summary: Retrieve all events
 *     description: Retrieves a list of all events.
 *     tags:
 *       - admin
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   admin_id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   location:
 *                     type: string
 *                   date_time:
 *                     type: string
 *                     format: date-time
 *                   duration_hours:
 *                     type: number
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
  .route("/get-all-events")
  .get(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), getAllEvents);

/**
 * @swagger
 * /api/v1/admin/delete-event/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Deletes an event by its ID.
 *     tags:
 *       - admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found"
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
  .route("/delete-event/:id")
  .delete(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), deleteEvent);

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

export default router;
