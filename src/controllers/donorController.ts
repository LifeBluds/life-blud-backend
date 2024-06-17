import { Request, Response } from "express";
import R from "../models/Request";
import { AppResponse } from "../utils";
import Http from "../constants/statusCodes";
import { sendAcceptanceMail, sendAppointmentMail } from "../emails";
import { Status } from "../interface";
import User from "../models/User";

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
        "This request is has been accepted",
        false,
      );
    }

    if (validRequest.sentTo !== user._id) {
      return AppResponse(
        res,
        Http.BAD_REQUEST,
        null,
        "This request is not associated with donor",
        false,
      );
    }

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
        user.emailAddress,
        validRequest.organizationName,
        donorFullName,
        validRequest.appointmentDate,
      ),

      // send appointment mail to donor
      sendAppointmentMail(
        facilityMail,
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
  // code goes here
};
export { fetchRequests, acceptRequest, rejectRequest };
