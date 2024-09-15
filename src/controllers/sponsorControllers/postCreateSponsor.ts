import { Request, Response } from "express";
import { PostCreateSponsorValidationSchema, validateRequest } from "../../validators";
import httpStatus from "http-status";
import * as z from "zod";
import { SponsorEntity } from "../../entity/eventRelations/SponsorEntity";
import { AppDataSource } from "../../database/dataSource";
import { EventEntity } from "../../entity/EventEntity";
import { ApiError } from "../../middlewares/error";
import { uploadImages } from "../../utils";

export async function postCreateSponsor(req: Request, res: Response) {
  try {
    const file = req.file as Express.Multer.File;

    validateRequest(PostCreateSponsorValidationSchema, req.body);

    const { name, category, description, website, eventId } = req.body as z.infer<
      typeof PostCreateSponsorValidationSchema
    >;

    const sponsorImage = await uploadImages([file]);

    const sponsor = new SponsorEntity();
    sponsor.name = name;
    sponsor.category = category;
    sponsor.description = description;
    sponsor.image = sponsorImage[0];
    sponsor.website = website;

    if (eventId) {
      const event = await AppDataSource.manager.findOne(EventEntity, {
        where: { id: eventId },
      });

      if (!event) throw new ApiError(httpStatus.NOT_FOUND, "Event not found.");

      sponsor.event = event;
    }

    await AppDataSource.manager.save(sponsor);

    return res.status(httpStatus.CREATED).json({ message: "Sponsor created successfully.", sponsor });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
