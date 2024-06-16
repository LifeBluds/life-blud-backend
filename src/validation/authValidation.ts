import joi from "joi";

export const lookUpMailSchema = joi.object({
  email: joi.string().email().trim().required(),
});

export const onboardDonorsSchema = joi.object({
  email: joi.string().email().trim().required(),
  age: joi.string().lowercase().required(),
  weight: joi.string().lowercase().required(),
  phoneNumber: joi.string().trim().required(),
  password: joi.string().trim().max(20).required(),
  pregnancyStatus: joi.string().lowercase().required(),
});

export const adminLoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const rejectFacilitySchema = joi.object({
  facilityId: joi.string().required().messages({
    "string.base": "Facility ID should be a type of text",
    "string.empty": "Facility ID cannot be empty",
    "any.required": "Facility ID is required",
  }),
  rejectionReason: joi.string().required().messages({
    "string.base": "Rejection Reason should be a type of text",
    "string.empty": "Rejection Reason cannot be empty",
    "any.required": "Rejection Reason is required",
  }),
});
