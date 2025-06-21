import mongoose, { Schema, Document, models } from 'mongoose';
import { DonationType } from "./blood_donation.models";
export interface IBlood_Request extends Document {
    bloodRequestId: string;
    patientName: string;
    hospitalName: string;
    hospitalAddress: {
        latitude: number;
        longitude: number;
    };
    address: string;
    blood_group: string;
    blood_component: DonationType;
    blood_quantity: number;
    contactNumber: string;
    priorityLevel: "Normal" | "Urgent";
    requestDate: Date;
    status: 'Pending' | 'Successful' | 'Unsuccessful' | 'Approved' | 'Rejected';
    document: {
        public_id: string;
        url:string;
        fileType: string;
    };
    bloodBankNotes: string;
    notes: string;
    redirected: number;
    requestor: Schema.Types.ObjectId;
    blood_bank: Schema.Types.ObjectId;
}

const BloodRequestSchema: Schema = new Schema({
    bloodRequestId: { type: String, unique: true },
    patientName: { type: String, required: true },
    hospitalName: { type: String, required: true },
    address: { type: String, required: true },
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
    blood_group: { type: String, required: true },
    blood_component: { type: String, enum: ["whole_blood", "rbc", "platelets", "plasma", "cryoprecipitate"], required: true },
    blood_quantity: { type: Number, required: true },
    contactNumber: { type: String, required: true },
    bloodBankNotes: { type: String, default: "" },
    priorityLevel: { type: String, enum: ['Normal', 'Urgent'], default: 'Normal' },
    status: { type: String, enum: ['Pending', 'Successful', 'Unsuccessful', 'Approved', 'Rejected'], default: 'Pending' },
    document: {
        publicId: String,
        url:String,
        fileType: String,
    },
    notes: { type: String },
    redirected: { type: Number, default: 0 },
    requestor: {
        type: Schema.Types.ObjectId,
        ref: 'Donor',
        required: true,
    },
    blood_bank: {
        type: Schema.Types.ObjectId,
        ref: 'Blood_bank',
        required: true,
    },
    nearby_blood_banks: [{
        type: Schema.Types.ObjectId,
        ref: 'Blood_bank',
    }],
    rejectedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Blood_bank',
        }
    ]
}, { timestamps: true });

export default models.Blood_request || mongoose.model<IBlood_Request>('Blood_request', BloodRequestSchema);