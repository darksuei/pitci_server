import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostCreateAwardValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { AwardsEntity } from "../../entity/awardRelations/AwardsEntity";
import { AppDataSource } from "../../database/dataSource";

export async function postCreateAward(req: Request, res: Response) {
  try {
    validateRequest(PostCreateAwardValidationSchema, req.body);

    const { title, description } = req.body as z.infer<typeof PostCreateAwardValidationSchema>;

    let award = new AwardsEntity();

    award.title = title;
    award.description = description;

    award = await AppDataSource.manager.save(award);

    return res
      .status(httpStatus.CREATED)
      .json({ success: true, message: "Award created successfully", award });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
