import express, { type Request, type Response } from "express";

const router = express.Router();

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Health Check
 *     tags:
 *       - health
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *
 */
router.get("/", (_req: Request, res: Response) => {
  res.send({ message: "OK" });
});

export default router;
