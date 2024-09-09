import { ApiError } from "./error";
import httpStatus from "http-status";
import { AuthRequest } from "../types/express";
import { UserEntity } from "../entity/UserEntity";
import { AppDataSource } from "../database/dataSource";
import { type Response, type NextFunction } from "express";
import AuthService from "../services/AuthService";
import { verifyToken } from "../utils";
import { type IJWTPayload } from "../types/jwt";

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authorizationToken = (req.headers.authorization ?? req.headers.Authorization) as string;

    if (!authorizationToken) throw new ApiError(httpStatus.UNAUTHORIZED, "Authorization token is required.");

    const jwtInfo = verifyToken(authorizationToken) as IJWTPayload;

    const user = await AppDataSource.manager.findOne(UserEntity, {
      where: { id: jwtInfo.id },
      relations: [
        "pitch",
        "pitch.personal_information",
        "pitch.professional_background",
        "pitch.competition_questions",
        "pitch.technical_agreement",
        "nominated_for",
        "nominated_for.award",
        "proposed_meetings",
        "proposed_meetings.proposer",
        "proposed_meetings.recipient",
        "proposed_meetings.review",
      ],
    });

    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

    await AuthService.validateAuth(jwtInfo.sessionId, user);

    req.user = user;

    return next();
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.UNAUTHORIZED)
      .json({ message: e.message ?? "Authorization Failed." });
  }
}
