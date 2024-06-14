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
