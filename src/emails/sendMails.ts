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
