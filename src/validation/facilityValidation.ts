import joi from "joi";

export const requestDonorSchema = joi.object({
  appointmentDate: joi.string().trim().required(),
  appointmentTime: joi.string().trim().required(),
  additionalInformation: joi.string().trim().lowercase(),
  bloodCollectionType: joi.string().trim().required(),
  bloodGroupRequired: joi.string().trim().required(),
});
