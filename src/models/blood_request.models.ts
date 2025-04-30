import mongoose, { Schema, Document, models } from 'mongoose';
import { DonationType } from "./blood_donation.models";
export interface IBlood_Request extends Document {
    patientName: string;
    hospitalName: string;
    hospitalAddress: {
        latitude: number;
        longitude: number;
    };
    blood_group: string;
    blood_component: DonationType;
    blood_quantity: number;
    contactNumber: string;
    priorityLevel: "Normal" | "Urgent";
    requestDate: Date;
    status: 'Pending' | 'Approved' | 'Rejected';
    document: string;
    notes: string;
    requestor: Schema.Types.ObjectId;
}

const BloodRequestSchema: Schema = new Schema({
    patientName: { type: String, required: true },
    hospitalName: { type: String, required: true },
    hospitalAddress: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
    },
    requestDate: { type: Date, required: true },
    blood_group: { type: Number, required: true },
    blood_component: { type: String, enum: ["whole_blood","rbc","platelets","plasma","cryoprecipitate"], required: true },
    blood_quantity: { type: String, required: true },
    contactNumber: { type: String, required: true },

    priorityLevel: { type: String, enum: ['Normal', 'Urgent'], default: 'Normal' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    document: { type: String,default: "" },
    notes: { type: String },
    requestor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

export default models.Blood_request || mongoose.model<IBlood_Request>('Blood_request', BloodRequestSchema);