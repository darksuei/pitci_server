import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppDataSource } from "../../database/dataSource";
import { SponsorEntity } from "../../entity/eventRelations/SponsorEntity";
import { ApiError } from "../../middlewares/error";

export async function deleteSponsor(req: Request, res: Response) {
  try {
    console.log("hi");
    const { id } = req.params;

    console.log(id, req.query);

    const sponsor = await AppDataSource.manager.findOne(SponsorEntity, {
      where: {
        id,
      },
    });

    if (!sponsor) throw new ApiError(httpStatus.NOT_FOUND, "Sponsor not found");

    await AppDataSource.manager.remove(sponsor);

    return res.status(httpStatus.OK).json({ message: "Sponsor deleted successfully" });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
