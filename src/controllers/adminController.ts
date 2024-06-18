import { Request, Response } from "express";
import { AppResponse } from "../utils";
import User from "../models/User";
import Http from "../constants/statusCodes";
import { adminLoginSchema, rejectFacilitySchema } from "../validation";
import { JWT_SECRET } from "./authController";
import bcrypt from "bcrypt";
import { ValidationError } from "joi";
import jwt from "jsonwebtoken";
import { sendProfileDeclineMail, sendProfileVerifiedMail } from "../emails";

const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = await adminLoginSchema.validateAsync(req.body);

    const user = await User.findOne({ emailAddress: email }).select(
      "+password",
    );

    if (!user) {
      return AppResponse(
        res,
        Http.BAD_REQUEST,
        null,
        "Invalid email or password",
        false,
      );
    }

    if (user.userType !== "Admin") {
      return AppResponse(
        res,
        Http.FORBIDDEN,
        null,
        "Admin permission required",
        false,
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return AppResponse(
        res,
        Http.BAD_REQUEST,
        null,
        "Invalid email or password",
        false,
      );
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    return AppResponse(res, Http.OK, { token }, "Admin Login successful", true);
  } catch (err: any) {
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
      "Internal server error",
      false,
    );
  }
};

/**
 * @desc Get Unverified Facilities
 */
const getUnverifiedFacilities = async (_req: Request, res: Response) => {
  try {
    const unverifiedFacilities = await User.find({
      userType: "Facility",
      isProfileVerified: false,
    });
    return AppResponse(
      res,
      Http.OK,
      unverifiedFacilities,
      "Unverified facilities fetched successfully",
      true,
    );
  } catch (err: any) {
    return AppResponse(
      res,
      Http.INTERNAL_SERVER_ERROR,
      null,
      "Internal server error",
      false,
    );
  }
};

/**
 * @desc Verify Facility
 */
const verifyFacility = async (req: Request, res: Response) => {
  try {
    const { facilityId } = req.params;

    const facility = await User.findById(facilityId);

    if (!facility) {
      return AppResponse(
        res,
        Http.NOT_FOUND,
        null,
        "Facility not found",
        false,
      );
    }

    await User.findByIdAndUpdate(facility._id, {
      isProfileVerified: true,
    });

    await sendProfileVerifiedMail(
      facility.emailAddress,
      facility.facilityInformation.organizationName,
    );

    return AppResponse(
      res,
      Http.OK,
      null,
      "Facility verified successfully",
      true,
    );
  } catch (err: any) {
    return AppResponse(
      res,
      Http.INTERNAL_SERVER_ERROR,
      null,
      "Internal server error",
      false,
    );
  }
};

/**
 * @desc Reject Facility
 */
const rejectFacility = async (req: Request, res: Response) => {
  try {
    const { facilityId } = req.params;
    const { rejectionReason } = await rejectFacilitySchema.validateAsync(
      req.body,
    );

    const facility = await User.findById(facilityId);

    if (!facility) {
      return AppResponse(
        res,
        Http.NOT_FOUND,
        null,
        "Facility not found",
        false,
      );
    }

    await User.findByIdAndUpdate(facility._id, {
      isProfileVerified: false,
      profileDeclineVerificationReason: rejectionReason,
    });

    await sendProfileDeclineMail(
      facility.emailAddress,
      facility.facilityInformation.organizationName,
      rejectionReason,
    );

    return AppResponse(
      res,
      Http.OK,
      null,
      "Facility verification rejected",
      true,
    );
  } catch (err: any) {
    console.error("rejectFacilityError:", err);

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
      "Internal server error",
      false,
    );
  }
};

export { loginAdmin, getUnverifiedFacilities, verifyFacility, rejectFacility };
