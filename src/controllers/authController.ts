import { Request, Response } from "express";
import { AppResponse } from "../utils";
import Http from "../constants/statusCodes";
import User from "../models/User";
import { ValidationError } from "joi";
import {
  completeDonorProfileSchema,
  lookUpMailSchema,
  onboardDonorsSchema,
} from "../validation";
import bcrypt from "bcrypt";
import { sendVerificationMail } from "../emails";

export const JWT_SECRET = String(process.env.JWT_SECRET);

async function hashPassword(password: string) {
  const salt = Number(process.env.SALT);
  return await bcrypt.hash(password, salt);
}

/**
 * @desc This allows the client find out if the email address
 * provided is not associated with another user
 */
const lookUpMail = async (req: Request, res: Response) => {
  try {
    const { email } = await lookUpMailSchema.validateAsync(req.body);
    const user = await User.findOne({ emailAddress: email });

    if (user) {
      return AppResponse(
        res,
        Http.BAD_REQUEST,
        null,
        "Email address is associated with another user",
        false,
      );
    }
    return AppResponse(
      res,
      Http.OK,
      null,
      "Email address is not associated with another user",
      true,
    );
  } catch (err: any) {
    console.error("LookUpMailError:", err);
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

/**
 * @desc Donor Registration
 */
const registerDonor = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber, password, age, weight, pregnancyStatus } =
      await onboardDonorsSchema.validateAsync(req.body);

    if (age === "under 18" || weight === "below 50kg") {
      return AppResponse(
        res,
        Http.BAD_REQUEST,
        null,
        "Donor does not meet criteria",
        false,
      );
    }

    const hashedPassword = await hashPassword(password);
    await User.create({
      emailAddress: email,
      phoneNumber,
      password: hashedPassword,
      eligibilityCriteria: {
        age,
        weight,
        pregnancyStatus,
      },
    });

    await sendVerificationMail(email);

    return AppResponse(
      res,
      Http.CREATED,
      null,
      "Donor registered successfully. Check your email to verify your account.",
      true,
    );
  } catch (err: any) {
    console.error("RegisterDonorError:", err);
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

/**
 * @desc Complete the profile for donor
 */
const completeDonorProfile = async (req: Request, res: Response) => {
  try {
    const {
      lifeStyleInformation,
      healthInformation,
      bloodGroup,
      bio,
      city,
      streetAddress,
      state,
      occupation,
      firstName,
      middleName,
      lastName,
      gender,
      maritalStatus,
    } = await completeDonorProfileSchema.validateAsync(req.body);

    const updateObject = {
      "lifeStyleInformation.smokingStatus": lifeStyleInformation.smokingStatus,
      "lifeStyleInformation.alcholConsumption":
        lifeStyleInformation.alcholConsumption,
      "lifeStyleInformation.alcholConsumptionFrequency":
        lifeStyleInformation.alcholConsumptionFrequency,
      "lifeStyleInformation.historyOfDrugAbuse":
        lifeStyleInformation.historyOfDrugAbuse,
      "lifeStyleInformation.yesHistoryOfDrugAbuse":
        lifeStyleInformation.yesHistoryOfDrugAbuse,
      "lifeStyleInformation.highRiskActivities":
        lifeStyleInformation.highRiskActivities,
      "lifeStyleInformation.yesHighRiskActivities":
        lifeStyleInformation.yesHighRiskActivities,
      "healthInformation.recentIllnessOrInfection":
        healthInformation.recentIllnessOrInfection,
      "healthInformation.yesRecentIllnessOrInfection":
        healthInformation.yesRecentIllnessOrInfection,
      "healthInformation.currentMedication":
        healthInformation.currentMedication,
      "healthInformation.yesCurrentMedication":
        healthInformation.yesCurrentMedication,
      "healthInformation.recentVaccination":
        healthInformation.recentVaccination,
      "healthInformation.yesRecentVaccination":
        healthInformation.yesRecentVaccination,
      "healthInformation.historyOfBloodTransfusionOrOrganTransplants":
        healthInformation.historyOfBloodTransfusionOrOrganTransplants,
      "healthInformation.yesHistoryOfBloodTransfusionOrOrganTransplants":
        healthInformation.yesHistoryOfBloodTransfusionOrOrganTransplants,
      "healthInformation.recentTravelHistory":
        healthInformation.recentTravelHistory,
      "healthInformation.yesRecentTravelHistory":
        healthInformation.yesRecentTravelHistory,
      bloodGroup,
      bio,
      city,
      streetAddress,
      state,
      occupation,
      firstName,
      middleName,
      lastName,
      gender,
      maritalStatus,
      isProfileVerified: true,
    };

    const updatedUser = await User.findByIdAndUpdate(req.user?._id, {
      $set: updateObject,
    });

    if (!updatedUser) {
      return AppResponse(res, Http.NOT_FOUND, null, "User not found", false);
    }

    return AppResponse(
      res,
      Http.OK,
      null,
      "Profile updated successfully",
      true,
    );
  } catch (err: any) {
    console.error("CompleteDonorProfileError:", err);
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

export { lookUpMail, registerDonor, completeDonorProfile };
