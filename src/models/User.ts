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
      organizationName: { type: String, default: null },
      website: { type: String, default: null },
      position: { type: String, default: null },
      operationalDetails: {
        hoursOfOperation: { type: String, default: null },
        daysOfOperation: { type: String, lowercase: true, default: null },
        bloodDonationService: {
          type: [String],
          lowercase: true,
          default: null,
        },
        capacity: { type: [String], lowercase: true, default: null },
        specialNoteOrRequirement: { type: String, default: null },
      },
      emergencyContactInformation: { type: String, default: null },
    },
    accreditation: {
      accreditationBody: { type: String, default: null },
      accreditationNumber: { type: String, default: null },
      certificate: { type: String, default: null },
    },
    isProfileComplete: { type: Boolean, default: false },
    requests: [{ type: mongoose.Types.ObjectId, ref: "Request" }],
  },
  { timestamps: true },
);

const User = mongoose.model<Iuser>("User", userSchema);
export default User;
