import { Request, Response } from "express";
import { AppDataSource } from "../../database/dataSource";
import { SponsorEntity } from "../../entity/eventRelations/SponsorEntity";
import httpStatus from "http-status";
import StorageService from "../../services/storage";

export async function getSponsors(_req: Request, res: Response) {
  try {
    const sponsors = await AppDataSource.manager.find(SponsorEntity, {
      relations: ["event"],
    });

    const storageService = new StorageService();

    for (const sponsor of sponsors) {
      if (sponsor.image?.includes("http") || !sponsor.image) continue;
      sponsor.image = await storageService.getPreSignedUrl(sponsor.image);
    }

    return res.status(httpStatus.OK).json(sponsors);
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
