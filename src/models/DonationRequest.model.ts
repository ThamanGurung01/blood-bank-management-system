import { Schema, model, Types } from 'mongoose';

const DonationRequestSchema = new Schema({
  donor: { type: Types.ObjectId, ref: 'Donor', required: true },
  blood_bank: { type: Types.ObjectId, ref: 'BloodBank', required: true },
  requested_date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  rejection_reason: { type: String, default: '' },
  scheduled_time_slot: { type: String }, // e.g., '10:00-11:00'
}, { timestamps: true });

export default model('DonationRequest', DonationRequestSchema);
