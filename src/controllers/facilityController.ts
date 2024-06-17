import { Request, Response } from "express";
import Http from "../constants/statusCodes";
import { AppResponse } from "../utils";
import User from "../models/User";
import R from "../models/Request";
import { requestDonorSchema } from "../validation";
import { ValidationError } from "joi";
import { sendRequestMail } from "../emails";

const getDonors = async (req: Request, res: Response) => {
  try {
    const { gender, bloodGroup, city, state, page = 1, limit = 10 } = req.query;

    const query: Record<string, any> = { userType: "Donor" };

    if (gender) query.gender = gender;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = city;
    if (state) query.state = state;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const omitField =
      "-facilityInformation -accreditation -isEmailVerified -isProfileVerified -isAccountSuspended -isProfileComplete";

    const donors = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit as string))
      .select(omitField);

    const totalDonors = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDonors / parseInt(limit as string));
    const currentPage = parseInt(page as string);
    const nextPage: number | boolean =
      currentPage < totalPages ? currentPage + 1 : false;
    const previousPage: number | boolean =
      currentPage > 1 ? currentPage - 1 : false;

    // Prepare the response object with pagination details
    const response = {
      donors,
      totalDonors,
      currentPage,
      next: nextPage,
      previous: previousPage,
    };

    return AppResponse(
      res,
      Http.OK,
      response,
      "Available donors fetched successfully",
      true,
    );
  } catch (err: any) {
    console.error("getDonorsError:", err);
    return AppResponse(
      res,
      Http.INTERNAL_SERVER_ERROR,
      null,
      "An internal server error occurred",
      false,
    );
  }
};

const requestDonor = async (req: Request, res: Response) => {
  try {
    const { donorId } = req.params;
    const user = req.user;

    if (!user) {
      return AppResponse(res, Http.NOT_FOUND, null, "User not found", false);
    }

    const donor = await User.findById(donorId);
    if (!donor) {
      return AppResponse(res, Http.NOT_FOUND, null, "Donor not found", false);
    }

    const {
      appointmentDate,
      additionalInformation,
      bloodCollectionType,
      bloodGroupRequired,
    } = await requestDonorSchema.validateAsync(req.body);

    const facilityName = user.facilityInformation.organizationName;
    const facilityAddress = user.streetAddress;

    await R.create({
      organizationName: facilityName,
      organizationAddress: facilityAddress,
      appointmentDate,
      additionalInformation,
      bloodCollectionType,
      bloodGroupRequired,
      sentTo: donor._id,
      sentBy: user._id,
    });

    // Send request notification mail to donor
    await sendRequestMail(donor.emailAddress, donor.firstName, facilityName);

    return AppResponse(
      res,
      Http.CREATED,
      null,
      "Request has been sent successfully, You will be notified via email for Donors response",
      true,
    );
  } catch (err: any) {
    console.error("requestDonorError:", err);
    if (err instanceof ValidationError) {
      return AppResponse(
        res,
        Http.UNPROCESSABLE_ENTITY,
        null,
        err.details[0].message,
        false,
      );
    }
    return AppResponse(
      res,
      Http.INTERNAL_SERVER_ERROR,
      null,
      "An internal server error occurred",
      false,
    );
  }
};

const getRequests = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { status } = req.query;

    if (!user) {
      return AppResponse(res, Http.NOT_FOUND, null, "User not found", false);
    }

    const query: Record<string, any> = { sentBy: user._id };
    if (status) query.status = status;

    const requests = await R.find(query);

    if (!requests) {
      return AppResponse(
        res,
        Http.NOT_FOUND,
        null,
        "Requests could not be retrieved",
        false,
      );
    }

    const response = {
      requests,
      totalRequests: await R.countDocuments(query),
    };

    return AppResponse(
      res,
      Http.OK,
      response,
      "Requests fetched successfully",
      true,
    );
  } catch (err: any) {
    console.error("getRequestError:", err);

    return AppResponse(
      res,
      Http.INTERNAL_SERVER_ERROR,
      null,
      "An internal server error occurred",
      false,
    );
  }
};

export { getDonors, requestDonor, getRequests };
