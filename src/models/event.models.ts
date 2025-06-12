import { Schema, Document, model, models, Types } from "mongoose";

export interface IEvent extends Document {
  name: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  type: 'emergency' | 'normal';
  description?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const eventSchema = new Schema<IEvent>({
  name: {
    type: String,
    required: true,
  },
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['emergency', 'normal'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Blood_bank',
    required: true,
  },
}, {
  timestamps: true,
});

export default models.Event || model<IEvent>('Event', eventSchema);