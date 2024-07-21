import express from "express";
import { getUser } from "../controllers/userControllers/getUser";
import { authenticate } from "../middlewares/authenticate";
import { postRequestForgotPasswordEmail } from "../controllers/userControllers/changePassword/postRequestForgotPasswordEmail";
import { postVerifyForgotPasswordCode } from "../controllers/userControllers/changePassword/postVerifyForgotPasswordCode";
import { patchUserPassword } from "../controllers/userControllers/changePassword/patchUserPassword";
import { postRequestPhoneNumberChange } from "../controllers/userControllers/addPhoneNumber/postRequestPhoneNumberChange";
import { patchPhoneNumber } from "../controllers/userControllers/addPhoneNumber/patchPhoneNumber";
import { patchNotificationSettings } from "../controllers/userControllers/patchNotificationSettings";
import { getBusinesses } from "../controllers/adminControllers/getBusinesses";
import { getAllEvents } from "../controllers/userControllers/getEvents";
import { getAlerts } from "../controllers/userControllers/alerts/getAlerts";
import { patchMarkAlertAsRead } from "../controllers/userControllers/alerts/patchMarkAlertAsRead";
import { postScheduleMeeting } from "../controllers/userControllers/postScheduleMeeting";
import { getScheduledMeetings } from "../controllers/userControllers/getScheduledMeetings";

const router = express.Router();

/**
 * @openapi
 * /api/v1/user:
 *   get:
 *     tags:
 *      - user
 *     summary: Get currently logged-in user information
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
router.route("/").get(authenticate, getUser);

/**
 * @swagger
 * /api/v1/user/get-businesses:
 *   get:
 *     summary: Get all businesses
 *     tags:
 *      - user
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
router.route("/get-businesses").get(getBusinesses);

/**
 * @openapi
 * /api/v1/user/update-notification-settings:
 *   patch:
 *     tags:
 *      - user
 *     summary: Update user notification settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *             type: object
 *             properties:
 *               notificationStatus:
 *                 type: boolean
 *                 format: boolean
 *                 example: true
 *               pitchNotificationStatus:
 *                 type: boolean
 *                 format: boolean
 *                 example: true
 *               postNotificationStatus:
 *                 type: boolean
 *                 format: boolean
 *                 example: true
 *               eventNotificationStatus:
 *                 type: boolean
 *                 format: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notification settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notification settings updated successfully
 *       400:
 *         description: Bad Request - Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/update-notification-settings").patch(authenticate, patchNotificationSettings);

/**
 * @openapi
 * /api/v1/user/password/request-forgot-password-email:
 *   post:
 *     summary: Request a forgot password email
 *     tags:
 *      - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code sent to ${email}
 *                 code:
 *                   type: string
 *                   description: The generated verification code
 *       400:
 *         description: Bad Request - Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *       403:
 *         description: Forbidden - Email mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email
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
router.route("/password/request-forgot-password-email").post(postRequestForgotPasswordEmail);

/**
 * @openapi
 * /api/v1/user/password/verify-forgot-password-code:
 *   post:
 *     summary: Verify forgot password code
 *     tags:
 *      - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               verificationCode:
 *                 type: string
 *                 description: The verification code sent in the forgot password email
 *     responses:
 *       200:
 *         description: Verification code is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code is valid
 *       400:
 *         description: Bad Request - Invalid verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid verification code
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
router.route("/password/verify-forgot-password-code").post(postVerifyForgotPasswordCode);

/**
 * @openapi
 * /api/v1/user/password/update-user-password:
 *   patch:
 *     summary: Update user password
 *     tags:
 *      - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               verificationCode:
 *                 type: string
 *                 description: The verification code sent in the forgot password email
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Bad Request - Invalid verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid verification code
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
router.route("/password/update-user-password").patch(patchUserPassword);

/**
 * @openapi
 * /api/v1/user/phone/request-phone-otp:
 *   post:
 *     summary: Request phone number change
 *     tags:
 *      - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+123 45 678910"
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification code sent to ${phoneNumber}
 *                 code:
 *                   type: string
 *                   description: The generated verification code
 *       400:
 *         description: Bad Request - Phone number already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Phone number already exists
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
router.route("/phone/request-phone-otp").post(authenticate, postRequestPhoneNumberChange);

/**
 * @openapi
 * /api/v1/user/phone/update-user-phone:
 *   patch:
 *     summary: Update user phone number
 *     tags:
 *      - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+123 456 78910"
 *               verificationCode:
 *                 type: string
 *                 description: The verification code sent in the phone number change email
 *     responses:
 *       200:
 *         description: Phone number updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Phone number updated successfully
 *       400:
 *         description: Bad Request - Invalid verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid verification code
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
router.route("/phone/update-user-phone").patch(authenticate, patchPhoneNumber);

/**
 * @swagger
 * /api/v1/user/get-all-events:
 *   get:
 *     summary: Retrieve all events
 *     description: Retrieves a list of all events.
 *     tags:
 *       - user
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
router.route("/get-all-events").get(getAllEvents);

/**
 * @swagger
 * /api/v1/user/get-alerts:
 *   get:
 *     summary: Get user alerts
 *     tags:
 *      - user
 *     description: Retrieves a list of all alerts associated with a user in the system.
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
router.route("/get-alerts").get(authenticate, getAlerts);

/**
 * @swagger
 * /api/v1/user/mark-alerts-as-read:
 *   patch:
 *     summary: Mark alert(s) as read
 *     description: Mark specific alerts as read or mark all alerts as read for the current user.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               markAllAsRead:
 *                 type: boolean
 *                 description: If true, all alerts for the user will be marked as read.
 *               alertIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of alert IDs to be marked as read.
 *             required:
 *               - markAllAsRead
 *     responses:
 *       200:
 *         description: Alerts marked as read.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Alerts marked as read.
 *       400:
 *         description: Bad request. Missing required fields or validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please provide either 'markAllAsRead' as true or a non-empty list of 'alertIds'.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/mark-alerts-as-read").patch(authenticate, patchMarkAlertAsRead);

/**
 * @openapi
 * /api/v1/user/schedule-meeting:
 *   post:
 *     summary: Schedule a meeting with a business
 *     tags:
 *      - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "example description"
 *               recipientId:
 *                 type: string
 *                 example: "uuid()"
 *               proposedMeetingStart:
 *                 type: string
 *                 example: "2022-01-01T00:00:00.000Z"
 *               proposedMeetingEnd:
 *                 type: string
 *                 example: "2022-01-01T01:00:00.000Z"
 *     responses:
 *       200:
 *         description: Meeting schedule successfully submitted to admin for approval.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Meeting schedule successfully submitted to admin for approval.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bad request
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
router.route("/schedule-meeting").post(authenticate, postScheduleMeeting);

/**
 * @swagger
 * /api/v1/user/get-scheduled-meetings:
 *   get:
 *     summary: Retrieve all user scheduled meetings
 *     description: Retrieves a list of all scheduled meetings.
 *     tags:
 *       - user
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
router.route("/get-scheduled-meetings").get(authenticate, getScheduledMeetings);

export default router;
