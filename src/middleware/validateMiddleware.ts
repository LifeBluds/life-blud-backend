import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import User from "../models/User";
import { BASE_URL, AppResponse } from "../utils";
import Http from "../constants/statusCodes";

const JWT_SECRET = String(process.env.JWT_SECRET);

export const validateEmailToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.params.token;
  let decode: jwt.JwtPayload;
  try {
    decode = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const user = await User.findOne({ emailAddress: decode.email });
    const { isEmailVerified } = user;

    // If clients email is verified redirect client back to login page
    if (isEmailVerified) {
      console.log("Email address has been verified initially");
      return res.redirect(`${BASE_URL}`);
    }

    next();
  } catch (err: any) {
    console.error("ValidateEmailTokenError:", err);
    if (err instanceof TokenExpiredError) {
      console.error("Verification token has expired");

      //TODO: This should redirect client to a 'link has expired page' and not a JSON response
      return AppResponse(
        res,
        Http.UNAUTHORIZED,
        null,
        "Verification link has expired",
        false,
      );
    }

    return AppResponse(
      res,
      Http.INTERNAL_SERVER_ERROR,
      null,
      "An error occured while validating token",
      false,
    );
  }
};

export const authorizeFacility = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user.userType !== "Facility") {
      return AppResponse(
        res,
        Http.FORBIDDEN,
        null,
        "Facility authorization required",
        false,
      );
    }

    next();
  } catch (err) {
    console.error("authorizeFacilityMiddlewareError:", err);
    return AppResponse(
      res,
      Http.UNAUTHORIZED,
      null,
      "An unexpected error has occurred",
      false,
    );
  }
};

export const profileCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const profileChecks = [
    { condition: !user.isProfileComplete, message: "Profile not completed" },
    { condition: !user.isProfileVerified, message: "Profile not verified" },
  ];

  for (const check of profileChecks) {
    if (check.condition) {
      return AppResponse(res, Http.UNAUTHORIZED, null, check.message);
    }
  }

  next();
};
