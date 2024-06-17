import mailer from "../helper/mailer";
import renderTemplate from "./templateHelper";
import { verificationToken } from "../utils";
import { SERVER_URL } from "../utils/baseUrl";

export const sendVerificationMail = async (email: string) => {
  const token: string = await verificationToken(email);
  const verificationLink: string = `${SERVER_URL}/api/auth/verify-email/${token}`;
  const emailSubject: string = `Verify your email address`;

  const emailBody = renderTemplate("verification-mail", {
    verificationLink,
    logoUrl: process.env.LOGO_URL,
  });

  await mailer(email, emailSubject, emailBody);
};

export const sendRequestMail = async (
  email: string,
  firstName: string,
  organizationName: string,
) => {
  const emailSubject: string = `You've got a request 🚀🚀`;
  const emailBody = renderTemplate("request-mail", {
    firstName,
    organizationName,
    logoUrl: process.env.LOGO_URL,
    loginLink:
      "https://concerned-bubble-just-rail-production.pipeops.app/auth/signin.html",
  });

  await mailer(email, emailSubject, emailBody);
};

export const sendAcceptanceMail = async (
  email: string,
  facilityName: string,
  donorName: string,
  appointmentDate: string,
) => {
  const emailSubject: string = `Donor request accepted 🎉🎉`;
  const emailBody = renderTemplate("acceptance-mail", {
    facilityName,
    donorName,
    appointmentDate,
    logoUrl: process.env.LOGO_URL,
  });
  await mailer(email, emailSubject, emailBody);
};

export const sendAppointmentMail = async (
  email: string,
  donorName: string,
  facilityName: string,
  appointmentDate: string,
  appointmentTime: string,
  facilityAddress: string,
  facilityPhone: string,
) => {
  const emailSubject: string = `Appointment Confirmation 🎉🎉`;
  const emailBody = renderTemplate("appointment-mail", {
    facilityName,
    donorName,
    appointmentDate,
    appointmentTime,
    facilityAddress,
    facilityPhone,
    logoUrl: process.env.LOGO_URL,
  });
  await mailer(email, emailSubject, emailBody);
};
