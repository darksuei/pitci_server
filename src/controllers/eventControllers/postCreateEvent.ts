import httpStatus from "http-status";
import { Request, Response } from "express";
import { PostCreateEventValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { EventEntity } from "../../entity/EventEntity";
import { AppDataSource } from "../../database/dataSource";
import { LinkEntity } from "../../entity/eventRelations/LinkEntity";
import { SponsorEntity } from "../../entity/eventRelations/SponsorEntity";
import AlertService from "../../services/AlertService";
import { uploadImages } from "../../utils";
import { ApiError } from "../../middlewares/error";

export async function postCreateEvent(req: Request, res: Response) {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    validateRequest(PostCreateEventValidationSchema, req.body, () => {
      if (!files["image"]) throw new ApiError(httpStatus.BAD_REQUEST, "Image file is required");
    });

    const {
      title,
      description,
      location,
      dateTime,
      durationHours,
      registrationLink,
      otherLinks,
      sponsors,
      day,
    } = req.body as z.infer<typeof PostCreateEventValidationSchema>;

    const imageRef = await uploadImages(files["image"]);
    const sponsorImagesRefs = await uploadImages(files["sponsorImages"]);

    let event = new EventEntity();
    event.admin_id = req.user!.id;
    event.title = title;
    event.day = day;
    event.description = description;
    event.location = location;
    event.date_time = new Date(dateTime);
    event.duration_hours = durationHours;
    event.registrationLink = registrationLink;
    event.image_ref = imageRef[0];
    event.sponsor_images_refs = sponsorImagesRefs;

    event = await AppDataSource.manager.save(event);

    otherLinks &&
      (await Promise.all(
        JSON.parse(otherLinks).map(async (link: any) => {
          const linkEntity = new LinkEntity();
          link.title && (linkEntity.title = link.title);
          linkEntity.url = link.url;
          linkEntity.event = event;
          return await AppDataSource.manager.save(linkEntity);
        })
      ));

    sponsors &&
      (await Promise.all(
        JSON.parse(sponsors).map(async (sponsor: any) => {
          const sponsorEntity = new SponsorEntity();
          sponsorEntity.name = sponsor.name;
          sponsorEntity.description = sponsor.description;
          sponsorEntity.image = sponsor.image;
          sponsorEntity.website = sponsor.website;
          sponsorEntity.event = event;
          return await AppDataSource.manager.save(sponsorEntity);
        })
      ));

    event = await AppDataSource.manager.findOneOrFail(EventEntity, {
      where: { id: event.id },
      relations: ["otherLinks", "sponsors"],
    });

    AlertService.newEvent(event);

    return res.status(httpStatus.CREATED).json({ message: "Event created successfully", event });
  } catch (e: any) {
    console.error(e);
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
