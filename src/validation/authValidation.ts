import joi from "joi";

export const lookUpMailSchema = joi.object({
  email: joi.string().email().trim().required(),
});

export const onboardDonorsSchema = joi.object({
  email: joi.string().lowercase().email().trim().required(),
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

export const completeDonorProfileSchema = joi.object({
  firstName: joi.string().trim().required().lowercase(),
  lastName: joi.string().trim().required().lowercase(),
  middleName: joi.string().trim().lowercase(),
  maritalStatus: joi.string().required().lowercase(),
  gender: joi.string().required().lowercase(),
  bio: joi.string().lowercase(),
  image: joi.string(),
  city: joi.string().required().lowercase(),
  state: joi.string().required().lowercase(),
  streetAddress: joi.string().required().lowercase(),
  occupation: joi.string().required().lowercase(),
  bloodGroup: joi.string().lowercase(),
  lifeStyleInformation: joi
    .object({
      smokingStatus: joi.boolean().required(),
      alcholConsumption: joi.boolean().required(),
      alcholConsumptionFrequency: joi.string().lowercase(),
      historyOfDrugAbuse: joi.boolean().required(),
      yesHistoryOfDrugAbuse: joi.array().items(joi.string().lowercase()),
      highRiskActivities: joi.boolean().required(),
      yesHighRiskActivities: joi.array().items(joi.string().lowercase()),
    })
    .required(),
  healthInformation: joi
    .object({
      recentIllnessOrInfection: joi.boolean().required(),
      yesRecentIllnessOrInfection: joi.array().items(joi.string().lowercase()),
      currentMedication: joi.boolean().required(),
      yesCurrentMedication: joi.array().items(joi.string().lowercase()),
      recentVaccination: joi.boolean().required(),
      yesRecentVaccination: joi.array().items(joi.string().lowercase()),
      historyOfBloodTransfusionOrOrganTransplants: joi.boolean().required(),
      yesHistoryOfBloodTransfusionOrOrganTransplants: joi
        .array()
        .items(joi.string().lowercase()),
      recentTravelHistory: joi.boolean().required(),
      yesRecentTravelHistory: joi.array().items(joi.string().lowercase()),
    })
    .required(),
});

export const registerFacilitySchema = joi.object({
  facilityType: joi.string().trim().lowercase().required(),
  email: joi.string().email().trim().required().lowercase(),
  regNumber: joi.string().trim().lowercase(),
  phoneNumber: joi.string().trim().required(),
  address: joi.string().trim().required().lowercase(),
  city: joi.string().trim().required().lowercase(),
  state: joi.string().trim().required().lowercase(),
  password: joi.string().trim().required(),
});

export const completeFacilityProfileSchema = joi.object({
  facilityInformation: {
    organizationName: joi.string().trim().required().lowercase(),
    website: joi.string().trim().lowercase(),
    position: joi.string().trim().lowercase(),
    operationalDetails: joi
      .object({
        hoursOfOperation: joi.string().required(),
        daysOfOperation: joi.string().required().trim().lowercase(),
        bloodDonationService: joi
          .array()
          .items(joi.string().lowercase())
          .required(),
        capacity: joi.array().items(joi.string()).required(),
        specialNoteOrRequirement: joi.string(),
      })
      .required(),
    emergencyContactInformation: joi.string().required(),
  },
  accreditation: joi
    .object({
      accreditationBody: joi.string().required(),
      accreditationNumber: joi.string().required(),
      certificate: joi.string().required(),
    })
    .required(),
});

export const loginSchema = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().trim().required(),
});
