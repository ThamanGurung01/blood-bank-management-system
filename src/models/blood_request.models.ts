import mongoose, { Schema, Document, models } from 'mongoose';

export interface IBlood_Request extends Document {
    patientName: string;
    address: {
        latitude: number;
        longitude: number;
    };
    blood_group: string;
    quantity: number;
    contactNumber: string;
    priorityLevel: "Normal" | "Urgent";
    status: 'Pending' | 'Approved' | 'Rejected';
    document: string;
    notes: string;
    requestor: Schema.Types.ObjectId;
}

const BloodRequestSchema: Schema = new Schema({
    patientName: { type: String, required: true },
    address: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
    },
    blood_group: { type: String, required: true },
    quantity: { type: Number, required: true },
    contactNumber: { type: String, required: true },
    priorityLevel: { type: String, enum: ['Normal', 'Urgent'], default: 'Normal' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    document: { type: String, required: true },
    notes: { type: String },
    requestor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

export default models.Blood_request || mongoose.model<IBlood_Request>('Blood_request', BloodRequestSchema);