import httpStatus from "http-status";
import { Request, Response } from "express";
import { PostCreateEventValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { EventEntity } from "../../entity/EventEntity";
import { AppDataSource } from "../../database/dataSource";
import { LinkEntity } from "../../entity/eventRelations/LinkEntity";
import { SponsorEntity } from "../../entity/eventRelations/SponsorEntity";
import AlertService from "../../services/AlertService";

export async function postCreateEvent(req: Request, res: Response) {
  try {
    validateRequest(PostCreateEventValidationSchema, req.body);

    const {
      title,
      description,
      location,
      dateTime,
      durationHours,
      durationDays,
      logo,
      registrationLink,
      otherLinks,
      sponsors,
    } = req.body as z.infer<typeof PostCreateEventValidationSchema>;

    let event = new EventEntity();
    event.admin_id = req.user!.id;
    event.title = title;
    event.description = description;
    event.location = location;
    event.date_time = new Date(dateTime);
    event.duration_hours = durationHours;
    event.duration_days = durationDays;
    event.logo = logo;
    event.registrationLink = registrationLink;

    event = await AppDataSource.manager.save(event);

    otherLinks &&
      (await Promise.all(
        otherLinks.map(async (link) => {
          const linkEntity = new LinkEntity();
          link.title && (linkEntity.title = link.title);
          linkEntity.url = link.url;
          linkEntity.event = event;
          return await AppDataSource.manager.save(linkEntity);
        })
      ));

    sponsors &&
      (await Promise.all(
        sponsors.map(async (sponsor) => {
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
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
