import { Request, Response } from "express";
import { AppResponse } from "../utils";
import Http from "../constants/statusCodes";
import User from "../models/User";
import { ValidationError } from "joi";
import { lookUpMailSchema, onboardDonorsSchema } from "../validation";
import bcrypt from "bcrypt";

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

export { lookUpMail, registerDonor };
