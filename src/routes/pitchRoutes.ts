import express from "express";
import { postInitiatePitch } from "../controllers/pitchControllers/postInitiatePitch";
import { authenticate } from "../middlewares/authenticate";
import { patchPitch } from "../controllers/pitchControllers/patchPitch";
import { getPitch } from "../controllers/pitchControllers/getPitch";
import { getAllPitches } from "../controllers/pitchControllers/getAllPitches";
import { deletePitch } from "../controllers/pitchControllers/deletePitch";
import { postSubmitPitch } from "../controllers/pitchControllers/postSubmitPitch";
import { getUserPitches } from "../controllers/pitchControllers/getUserPitches";

const router = express.Router();

/**
 * @openapi
 * /api/v1/pitch/get-all-pitches:
 *   get:
 *     summary: Get all pitches
 *     tags:
 *       - pitch
 *     responses:
 *       200:
 *         description: List of all pitches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 numberOfPitches:
 *                   type: integer
 *                   description: The total number of pitches retrieved
 *                 pitches:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - Access restricted to authorized users only
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
router.route("/get-all-pitches").get(getAllPitches);

/**
 * @openapi
 * /api/v1/pitch/initiate-pitch:
 *   post:
 *     summary: Initiate a new pitch
 *     tags:
 *      - pitch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *                 minLength: 10
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               nationality:
 *                 type: string
 *               ethnicity:
 *                 type: string
 *               requiresDisabilitySupport:
 *                 type: boolean
 *               disabilitySupportDescription:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Pitch initiated successfully
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
 *                   example: Pitch saved successfully.
 *                 pitch:
 *                   type: object
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
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.route("/initiate-pitch").post(authenticate, postInitiatePitch);

/**
 * @openapi
 * /api/v1/pitch/get-pitch/{id}:
 *   get:
 *     summary: Get user pitch details
 *     tags:
 *      - pitch
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
 * @openapi
 * /api/v1/pitch/get-user-pitches:
 *   get:
 *     summary: Get user pitches list
 *     tags:
 *      - pitch
 *     responses:
 *       200:
 *         description: List of user pitches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 pitches:
 *                   type: array
 *                   items:
 *                     type: object
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
router.route("/get-user-pitches").get(authenticate, getUserPitches);

/**
 * @openapi
 * /api/v1/pitch/submit-pitch/{id}:
 *   post:
 *     summary: Submit a pitch
 *     tags:
 *      - pitch
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The pitch ID
 *     responses:
 *       200:
 *         description: Pitch submitted successfully
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
 *                   example: Pitch Submitted Successfully.
 *                 pitch:
 *                   type: object
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pitch already submitted
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
router.route("/submit-pitch/:id").post(authenticate, postSubmitPitch);

/**
 * @openapi
 * /api/v1/pitch/update-pitch/{step}/{id}:
 *   patch:
 *     summary: Update a pitch
 *     tags:
 *       - pitch
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The pitch ID
 *       - name: step
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The pitch update step
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pitch updated successfully
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
 *                   example: Pitch updated successfully
 *                 pitch:
 *                   type: object
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
router.route("/update-pitch/:id/:step").patch(authenticate, patchPitch);

/**
 * @openapi
 * /api/v1/pitch/delete-pitch/{id}:
 *   delete:
 *     summary: Delete a pitch
 *     tags:
 *      - pitch
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The pitch ID
 *     responses:
 *       200:
 *         description: Pitch deleted successfully
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
 *                   example: Pitch Deleted Successfully.
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
router.route("/delete-pitch/:id").delete(authenticate, deletePitch);

export default router;
