import express from "express";
import { getUser } from "../controllers/userControllers/getUser";
import { authenticate } from "../middlewares/authenticate";
import { postRequestForgotPasswordEmail } from "../controllers/userControllers/changePassword/postRequestForgotPasswordEmail";
import { postVerifyForgotPasswordCode } from "../controllers/userControllers/changePassword/postVerifyForgotPasswordCode";
import { patchUserPassword } from "../controllers/userControllers/changePassword/patchUserPassword";
import { postRequestPhoneNumberChange } from "../controllers/userControllers/addPhoneNumber/postRequestPhoneNumberChange";
import { patchPhoneNumber } from "../controllers/userControllers/addPhoneNumber/patchPhoneNumber";
import { patchNotificationSettings } from "../controllers/userControllers/patchNotificationSettings";

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

export default router;
