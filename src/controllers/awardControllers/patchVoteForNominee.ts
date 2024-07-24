import { Request, Response } from "express";
import httpStatus from "http-status";
import { PatchVoteForNomineeValidationSchema, validateRequest } from "../../validators";
import { AppDataSource } from "../../database/dataSource";
import { AwardNomineesEntity } from "../../entity/awardRelations/AwardNomineeesEntity";
import * as z from "zod";
import { ApiError } from "../../middlewares/error";
import { UserEntity } from "../../entity/UserEntity";
import { VoteEntity } from "../../entity/awardRelations/VoteEntity";
import { AwardsEntity } from "../../entity/awardRelations/AwardsEntity";
import { AwardStatusEnum } from "../../utils/enums";

export async function patchVoteForNominee(req: Request, res: Response) {
  try {
    validateRequest(PatchVoteForNomineeValidationSchema, req.body);

    const { nomineeId, awardId } = req.body as z.infer<typeof PatchVoteForNomineeValidationSchema>;

    const award = await AppDataSource.manager.findOne(AwardsEntity, {
      where: {
        id: awardId,
        status: AwardStatusEnum.VOTING_OPEN,
      },
    });

    if (!award) throw new ApiError(httpStatus.NOT_FOUND, "Award not found or voting not open yet.");

    const nominee = await AppDataSource.manager.findOne(AwardNomineesEntity, {
      where: [
        { nominee_id: nomineeId, award: { id: awardId } },
        { id: nomineeId, award: { id: awardId } },
      ],
      relations: ["votes", "award"],
    });

    if (!nominee) throw new ApiError(httpStatus.NOT_FOUND, "Nominee not found under this award category.");

    const userId = req.user!.id;

    const user = await AppDataSource.manager.findOneOrFail(UserEntity, {
      where: {
        id: userId,
      },
      relations: ["votes", "votes.nominee", "votes.nominee.award"],
    });

    const hasUserVoted = user.votes.some((vote) => vote.nominee.award.id === awardId);

    if (hasUserVoted)
      throw new ApiError(httpStatus.BAD_REQUEST, "You have already voted for this award category.");

    nominee.votes_count = nominee.votes_count ? nominee.votes_count + 1 : 1;

    await AppDataSource.manager.save(nominee);

    const vote = new VoteEntity();
    vote.user = user!;
    vote.nominee = nominee;

    await AppDataSource.manager.save(vote);

    return res.status(httpStatus.OK).json({ message: "Vote submitted successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
