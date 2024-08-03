import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { requireDesktopClient } from "../middlewares/requireDesktopClient";
import { authorization } from "../middlewares/authorization";
import { RoleEnum } from "../utils/enums";
import { postCreateAward } from "../controllers/awardControllers/postCreateAward";
import { getNominees } from "../controllers/awardControllers/getNominees";
import { postNominate } from "../controllers/awardControllers/postNominate";
import { patchAwardStatus } from "../controllers/awardControllers/patchAwardStatus";
import { patchVoteForNominee } from "../controllers/awardControllers/patchVoteForNominee";
import { deleteAward } from "../controllers/awardControllers/deleteAward";
import { getAwards } from "../controllers/awardControllers/getAwards";

const router = express.Router();

/**
 * @swagger
 * /api/v1/award/create-award:
 *   post:
 *     summary: Create a new award (ADMIN ONLY)
 *     description: Creates a new award with the provided details.
 *     tags:
 *       - award
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the award
 *                 example: "Best Business of the Year"
 *               description:
 *                 type: string
 *                 description: The description of the award
 *                 example: "This award is for the best business."
 *     responses:
 *       201:
 *         description: Award created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Award created successfully"
 *                 award:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     status:
 *                       type: string
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
  .route("/create-award")
  .post(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), postCreateAward);

/**
 * @swagger
 * /api/v1/award/nominate-for-award:
 *   post:
 *     summary: Nominate for award
 *     description: Nominate a business for an award.
 *     tags:
 *       - award
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomineeId:
 *                 type: string
 *                 description: The id of the nominee - could be userId or businessId or pitchId
 *                 example: "userId | businessId | pitchId"
 *               nomineeType:
 *                 type: string
 *                 description: The type of the nominee - could be user | business | pitch
 *                 example: "business | user | pitch"
 *               awardId:
 *                 type: string
 *                 description: The id of the award the nominee is getting nominated for
 *                 example: "uuid()"
 *               reason:
 *                 type: string
 *                 description: The reason for nominating (optional)
 *                 example: "A very good business"
 *     responses:
 *       201:
 *         description: Nomination Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nomination successful"
 *                 nominee:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     award:
 *                       type: object
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
router.route("/nominate-for-award").post(authenticate, postNominate);

/**
 * @swagger
 * /api/v1/award/toggle-award-status:
 *   post:
 *     summary: Toggle the award status (ADMIN ONLY)
 *     description: Nominate a business for an award.
 *     tags:
 *       - award
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The status to set the award to
 *                 example: "'not-started' | 'nominations-open' | 'voting-open' | 'closed'"
 *               awardId:
 *                 type: string
 *                 description: The id of the award to set the new status for
 *                 example: "uuid()"
 *     responses:
 *       201:
 *         description: Business Nominated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business nominated created successfully"
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
  .route("/toggle-award-status")
  .post(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), patchAwardStatus);

/**
 * @swagger
 * /api/v1/award/vote-for-nominee:
 *   post:
 *     summary: Vote for a nominee
 *     description: Cast a vote for a nominee of an award.
 *     tags:
 *       - award
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomineeId:
 *                 type: string
 *                 description: The id of the nominee to vote for.
 *                 example: "uuid()"
 *               awardId:
 *                 type: string
 *                 description: The id of the current award.
 *                 example: "uuid()"
 *     responses:
 *       201:
 *         description: Vote created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote created successfully"
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
router.route("/vote-for-nominee").post(authenticate, patchVoteForNominee);

/**
 * @swagger
 * /api/v1/award/get-award-nominees/{id}:
 *   get:
 *     summary: Retrieve all nominees for a given award.
 *     description: Retrieves a list of all nominees for a given award.
 *     tags:
 *       - award
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The award ID
 *     responses:
 *       200:
 *         description: A list of nominees
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
 *                   award:
 *                     type: object
 *                   votes:
 *                     type: array
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
router.route("/get-award-nominees/:id").get(authenticate, getNominees);

/**
 * @swagger
 * /api/v1/award/delete-award/{id}:
 *   delete:
 *     summary: Delete an award (ADMIN ONLY)
 *     description: Deletes an award by its ID.
 *     tags:
 *       - award
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the award to delete
 *     responses:
 *       200:
 *         description: Award deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Award deleted successfully"
 *       404:
 *         description: Award not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Award not found"
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
  .route("/delete-award/:id")
  .delete(authenticate, requireDesktopClient, authorization(RoleEnum.ADMIN), deleteAward);

/**
 * @swagger
 * /api/v1/award/get-awards:
 *   get:
 *     summary: Retrieve all awards
 *     description: Retrieves a list of all awards.
 *     tags:
 *       - award
 *     responses:
 *       200:
 *         description: A list of awards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
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
router.route("/get-awards").get(authenticate, getAwards);

export default router;
