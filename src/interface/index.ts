import { Types } from "mongoose";

// Extend the express Request interface to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: Iuser;
  }
}

export enum UserType {
  Donor = "Donor",
  Facility = "Facility",
  Admin = "Admin",
}

export enum Status {
  Pending = "Pending",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

interface OperationalDetails {
  hoursOfOperation: string;
  daysOfOperation: string[];
  bloodDonationService: string[];
  capacity: string[];
  specialNoteOrRequirement: string;
}

interface EligibilityCriteria {
  age: string;
  weight: string;
  pregnancyStatus: string;
}

interface LifeStyleInformation {
  smokingStatus: boolean;
  alcholConsumption: boolean;
  alcholConsumptionFrequency: string;
  historyOfDrugAbuse: boolean;
  yesHistoryOfDrugAbuse: string[];
  highRiskActivities: boolean;
  yesHighRiskActivities: string[];
}

interface HealthInformation {
  recentIllnessOrInfection: boolean;
  yesRecentIllnessOrInfection: string[];
  currentMedication: boolean;
  yesCurrentMedication: string[];
  recentVaccination: boolean;
  yesRecentVaccination: string[];
  historyOfBloodTransfusionOrOrganTransplants: boolean;
  yesHistoryOfBloodTransfusionOrOrganTransplants: string[];
  recentTravelHistory: boolean;
  yesRecentTravelHistory: string[];
}

interface FacilityInformation {
  organizationName: string;
  website: string;
  position: string;
  operationalDetails: OperationalDetails;
  emergencyContactInformation: string;
}

interface Certification {
  accreditationBody: string;
  accreditationNumber: string;
  certificate: string;
}

export interface Iuser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  middleName: string;
  emailAddress: string;
  DOB: string;
  maritalStatus: string;
  isEmailVerified: boolean;
  isProfileVerified: boolean;
  password: string;
  gender: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  bio: string;
  image: string;
  city: string;
  state: string;
  streetAddress: string;
  occupation: string;
  bloodGroup: string;
  isAccountSuspended: boolean;
  userType: UserType;
  socialMedia: string[];
  eligibilityCriteria: EligibilityCriteria;
  lifeStyleInformation: LifeStyleInformation;
  healthInformation: HealthInformation;
  facilityInformation: FacilityInformation;
  accreditation: Certification;
  isProfileComplete: boolean;
  requests: Array<Types.ObjectId>;
}
