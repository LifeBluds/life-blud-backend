import { Request, Response } from "express";
import R from "../models/Request";
import { AppResponse } from "../utils";
import Http from "../constants/statusCodes";
import {
  sendAcceptanceMail,
  sendAppointmentMail,
  sendDeclineMail,
} from "../emails";
import { Status } from "../interface";
import User from "../models/User";
import { rejectRequestSchema } from "../validation";

const fetchRequests = async (req: Request, res: Response) => {
  try {
    const user = req.user._id;
    const requests = await R.find({ sentTo: user }).populate("sentBy");

    return AppResponse(
      res,
      Http.OK,
      requests,
      "Requests fetched successfully",
      true,
    );
  } catch (err: any) {
    console.error("fetchRequestError:", err);
    return AppResponse(
      res,
      Http.INTERNAL_SERVER_ERROR,
      null,
      "An internal server error occurred",
      false,
    );
  }
};

const acceptRequest = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { requestId } = req.params;

    const validRequest = await R.findById(requestId);
    if (!validRequest) {
      return AppResponse(res, Http.NOT_FOUND, null, "Invalid request", false);
    }

    if (validRequest.status === Status.Accepted) {
      return AppResponse(
        res,
        Http.CONFLICT,
        null,
        "This request is has been accepted initially",
        false,
      );
    }

    /* if (
      new mongoose.Types.ObjectId(validRequest.sentTo) !==
      new mongoose.Types.ObjectId(user._id)
    ) {
      return AppResponse(
        res,
        Http.BAD_REQUEST,
        null,
        "This request is not associated with donor",
        false,
      );
    } */

    await R.findByIdAndUpdate(requestId, {
      status: Status.Accepted,
      respondedAt: Date.now(),
    });
    const donorFullName = `${user.firstName} ${user.lastName}`;

    const facility = await User.findById(validRequest.sentBy);
    const facilityAddress = validRequest.organizationAddress;
    const facilityPhone = facility.phoneNumber;
    const facilityMail = facility.emailAddress;

    // Send mail to facility and donor concurrently
    await Promise.all([
      // Send mail to facility
      sendAcceptanceMail(
        facilityMail,
        validRequest.organizationName,
        donorFullName,
        validRequest.appointmentDate,
      ),

      // send appointment mail to donor
      sendAppointmentMail(
        user.emailAddress,
        donorFullName,
        validRequest.organizationName,
        validRequest.appointmentDate,
        validRequest.appointmentTime,
        facilityAddress,
        facilityPhone,
      ),
    ]);

    return AppResponse(
      res,
      Http.OK,
      null,
      "Request accepted successfully",
      true,
    );
  } catch (err: any) {
    console.error("acceptRequestError:", err);
    return AppResponse(
      res,
      Http.INTERNAL_SERVER_ERROR,
      null,
      "An internal server error occurred",
      false,
    );
  }
};

const rejectRequest = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { requestId } = req.params;
    const { rejectionReason } = await rejectRequestSchema.validateAsync(
      req.body,
    );

    const validRequest = await R.findById(requestId);
    if (!validRequest) {
      return AppResponse(res, Http.NOT_FOUND, null, "Invalid request", false);
    }

    if (validRequest.status === Status.Rejected) {
      return AppResponse(
        res,
        Http.CONFLICT,
        null,
        "This request is has been rejected initially",
        false,
      );
    }

    await R.findByIdAndUpdate(requestId, {
      status: Status.Rejected,
      respondedAt: Date.now(),
      rejectionReason,
    });

    const donorFullName = `${user.firstName} ${user.lastName}`;
    const facility = await User.findById(validRequest.sentBy);
    const facilityMail = facility.emailAddress;

    await sendDeclineMail(
      facilityMail,
      validRequest.organizationName,
      donorFullName,
      rejectionReason,
    );

    return AppResponse(
      res,
      Http.OK,
      null,
      "Request decline successfully",
      true,
    );

    // send mail to decline mail to facility with the rejection reason
  } catch (err: any) {
    console.error("rejectRequestError:", err);
    return AppResponse(
      res,
      Http.INTERNAL_SERVER_ERROR,
      null,
      "An internal server error occurred",
      false,
    );
  }
};
export { fetchRequests, acceptRequest, rejectRequest };
