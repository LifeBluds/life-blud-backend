import joi from "joi";

export const rejectRequestSchema = joi.object({
  rejectionReason: joi.string().trim().required(),
});
