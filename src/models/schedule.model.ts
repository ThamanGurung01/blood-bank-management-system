import { Schema, model, Types } from "mongoose";

const ScheduleSchema = new Schema(
  {
    blood_bank: { type: Types.ObjectId, ref: "BloodBank", required: true },
    date: { type: Date, required: true },
    time_slot: { type: String, required: true }, // '10:00-11:00'
    isBooked: { type: Boolean, default: false },
    donor: { type: Types.ObjectId, ref: "Donor" },
  },
  { timestamps: true }
);

ScheduleSchema.index(
  { blood_bank: 1, date: 1, time_slot: 1 },
  { unique: true }
);

export default model("Schedule", ScheduleSchema);
