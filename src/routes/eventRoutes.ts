import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { requireDesktopClient } from "../middlewares/requireDesktopClient";
import { authorization } from "../middlewares/authorization";
import { RoleEnum } from "../utils/enums";
import { deleteEvent } from "../controllers/eventControllers/deleteEvent";
import { getAllEvents } from "../controllers/userControllers/getEvents";
import { postCreateEvent } from "../controllers/eventControllers/postCreateEvent";
import { getEventById } from "../controllers/eventControllers/getEventById";
// import multer from "multer";

// const storage = multer.memoryStorage();

// const upload = multer({ storage: storage });

const router = express.Router();

/**
 * @swagger
 * /api/v1/event/create-event:
 *   post:
 *     summary: Create a new event (ADMIN ONLY)
 *     description: Creates a new event with the provided details.
 *     tags:
 *       - event
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
 *               day:
 *                 type: string
 *                 description: The current day
 *                 example: "Day 1"
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
 *               image:
 *                 type: string
 *                 description: The event logo / custom image.
 *                 example: 3
 *               registrationLink:
 *                 type: string
 *                 description: The registration link for the event
 *                 example: "https://example.com/register"
 *               sponsors:
 *                 type: array
 *                 description: A list of sponsors for the event
 *                 example: [{ name: "Sponsor 1", description: "Description 1", image: "https://example.com/logo1", website: "https://example.com/sponsor1" }]
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
 * /api/v1/event/get-all-events:
 *   get:
 *     summary: Retrieve all events
 *     description: Retrieves a list of all events.
 *     tags:
 *       - event
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
 * /api/v1/event/get-event/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Get an event by its ID.
 *     tags:
 *       - event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event retrieved successfully"
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
router.route("/get-event/:id").get(getEventById);

/**
 * @swagger
 * /api/v1/event/delete-event/{id}:
 *   delete:
 *     summary: Delete an event (ADMIN ONLY)
 *     description: Deletes an event by its ID.
 *     tags:
 *       - event
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

export default router;
