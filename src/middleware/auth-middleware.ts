import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import User from "../models/User";
import { AppResponse } from "../utils";
import Http from "../constants/statusCodes";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return AppResponse(
      res,
      Http.UNAUTHORIZED,
      null,
      "No token provided",
      false,
    );
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);

    if (!user) {
      return AppResponse(res, Http.NOT_FOUND, null, "User not found", false);
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("authMiddlewareError:", err);

    if (err instanceof TokenExpiredError) {
      return AppResponse(res, Http.UNAUTHORIZED, null, "Token expired", false);
    }

    return AppResponse(res, Http.UNAUTHORIZED, null, "Invalid token", false);
  }
};

const authorizeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user.userType !== "Admin") {
      return AppResponse(
        res,
        Http.FORBIDDEN,
        null,
        "Admin authorization needed",
        false,
      );
    }

    next();
  } catch (err) {
    console.error("AuthorizeMiddleWareError:", err);
    return AppResponse(
      res,
      Http.UNAUTHORIZED,
      null,
      "An unexpected error has occurred",
      false,
    );
  }
};

export { authMiddleware, authorizeAdmin };
