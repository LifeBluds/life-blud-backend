import mongoose, { Schema } from "mongoose";
import { Iuser, UserType } from "../interface";

const userSchema: Schema<Iuser> = new Schema<Iuser>(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    middleName: { type: String, trim: true },
    emailAddress: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: true,
    },
    DOB: { type: String },
    maritalStatus: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isProfileVerified: { type: Boolean, default: false },
    password: { type: String, trim: true, select: false },
    gender: { type: String, trim: true },
    phoneNumber: { type: String },
    alternatePhoneNumber: { type: String },
    bio: { type: String },
    image: { type: String },
    city: { type: String },
    state: { type: String },
    streetAddress: { type: String },
    occupation: { type: String },
    bloodGroup: { type: String },
    isAccountSuspended: { type: Boolean, default: false },
    userType: { type: String, default: UserType.Donor },
    socialMedia: { type: [String] },
    eligibilityCriteria: {
      age: { type: String, trim: true },
      weight: { type: String, trim: true },
      pregnancyStatus: { type: String, default: "not-pregnant" },
    },
    lifeStyleInformation: {
      smokingStatus: { type: Boolean, default: false },
      alcholConsumption: { type: Boolean, default: false },
      alcholConsumptionFrequency: { type: String, lowercase: true },
      historyOfDrugAbuse: { type: Boolean, default: false },
      yesHistoryOfDrugAbuse: { type: [String], lowercase: true },
      highRiskActivities: { type: Boolean, default: false },
      yesHighRiskActivities: { type: [String], lowercase: true },
    },
    healthInformation: {
      recentIllnessOrInfection: { type: Boolean, default: false },
      yesRecentIllnessOrInfection: { type: [String], lowercase: true },
      currentMedication: { type: Boolean, default: false },
      yesCurrentMedication: { type: [String], lowercase: true },
      recentVaccination: { type: Boolean, default: false },
      yesRecentVaccination: { type: [String], lowercase: true },
      historyOfBloodTransfusionOrOrganTransplants: {
        type: Boolean,
        default: false,
      },
      yesHistoryOfBloodTransfusionOrOrganTransplants: {
        type: [String],
        lowercase: true,
      },
      recentTravelHistory: { type: Boolean, default: false },
      yesRecentTravelHistory: { type: [String], lowercase: true },
    },
    facilityInformation: {
      facilityType: { type: String },
      organizationName: { type: String },
      website: { type: String },
      position: { type: String },
      operationalDetails: {
        hoursOfOperation: { type: String },
        daysOfOperation: { type: String, lowercase: true },
        bloodDonationService: {
          type: [String],
          lowercase: true,
          default: null,
        },
        capacity: { type: [String], lowercase: true },
        specialNoteOrRequirement: { type: String },
      },
      emergencyContactInformation: { type: String },
    },
    accreditation: {
      accreditationBody: { type: String },
      accreditationNumber: { type: String },
      certificate: { type: String },
    },
    isProfileComplete: { type: Boolean, default: false },
    requests: [{ type: mongoose.Types.ObjectId, ref: "Request" }],
  },
  { timestamps: true },
);

const User = mongoose.model<Iuser>("User", userSchema);
export default User;
