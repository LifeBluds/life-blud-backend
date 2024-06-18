import mongoose, { Schema } from "mongoose";
import { Status, Irequest } from "../interface";

const requestSchema: Schema<Irequest> = new Schema<Irequest>({
  organizationName: { type: String, required: true },
  organizationAddress: { type: String, required: true },
  appointmentDate: { type: String, required: false },
  appointmentTime: { type: String, required: false },
  status: { type: String, default: Status.Pending },
  respondedAt: { type: Date, required: false },
  additionalInformation: {
    type: String,
    required: false,
    default:
      "Please ensure you are hydrated and have eaten before the appointment.",
  },
  bloodGroupRequired: { type: String, required: true },
  bloodCollectionType: { type: String, required: true },
  rejectionReason: { type: String, default: null, required: false },
  sentTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sentBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now() },
});

const Request = mongoose.model<Irequest>("Request", requestSchema);
export default Request;
