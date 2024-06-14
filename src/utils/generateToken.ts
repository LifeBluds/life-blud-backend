import jwt from "jsonwebtoken";

const JWT_SECRET = String(process.env.JWT_SECRET);
const VERIFICATION_TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN; // 30min

/**
 * @desc: This function creates a token to be appended to the email to verify user email address
 */
export const verificationToken = async (email: string) => {
  try {
    const token = jwt.sign({ email }, JWT_SECRET, {
      expiresIn: VERIFICATION_TOKEN_EXPIRES_IN,
    });
    if (!token) {
      console.error("verificationTokenError: token could not be signed");
      return "An unexpected error occurred, kindly try again in a few minute.";
    }
    return token;
  } catch (err: any) {
    console.log("Error:", err.message);
    return "An unexpected error has occurred, kindly try again in 2 minute.";
  }
};
