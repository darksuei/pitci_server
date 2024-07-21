import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostCreateBusinessValidationSchema, validateRequest } from "../../validators";
import * as z from "zod";
import { BusinessEntity } from "../../entity/BusinessEntity";
import { AppDataSource } from "../../database/dataSource";
import { ApiError } from "../../middlewares/error";

export async function postCreateBusiness(req: Request, res: Response) {
  try {
    validateRequest(PostCreateBusinessValidationSchema, req.body);

    const {
      businessName,
      businessDescription,
      businessOwnerName,
      businessOwnerEmail,
      businessOwnerPhone,
      website,
      logo,
    } = req.body as z.infer<typeof PostCreateBusinessValidationSchema>;

    const existingBusiness = await AppDataSource.manager.findOne(BusinessEntity, {
      where: { business_name: businessName },
    });

    if (existingBusiness) throw new ApiError(httpStatus.CONFLICT, "Business with this name already exists");

    let business = new BusinessEntity();
    business.business_name = businessName;
    business.business_description = businessDescription;
    business.business_owner_email = businessOwnerEmail;
    business.business_owner_name = businessOwnerName;
    business.business_owner_phone = businessOwnerPhone;
    business.website = website;
    business.logo = logo;

    business = await AppDataSource.manager.save(business);

    return res
      .status(httpStatus.CREATED)
      .json({ success: true, message: "Business created successfully", business });
  } catch (e: any) {
    return res
      .status(e.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: e.message ?? "Internal Server Error" });
  }
}
