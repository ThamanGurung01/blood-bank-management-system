import { Schema,Document,model,models } from "mongoose";
import { string } from "zod";
export type Role= 'donor' | 'blood_bank' | 'admin';
export interface IDonor extends Document{
    user:Schema.Types.ObjectId;
    donorId:string;
    blood_group:string;
    age:string;
    location:{
        latitude:number;
        longitude:number;
    };
    contact:string;
    status:boolean;
    donations:Array<{
        bloodBank:Schema.Types.ObjectId;
        date:Date;
    }>;
}
const DonorSchema=new Schema<IDonor>({
    donorId: { type: String, unique: true },
    blood_group:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true},
    location:{
        latitude:{
            type:Number,
            required:true
        },
        longitude:{
            type:Number,
            required:true
        },
    },
    contact:{
        type:String,
        required:true
    }
,
donations: [
    {
      bloodBank: { type: Schema.Types.ObjectId, ref: "blood_bank" },
      date: { type: Date, required: true },
    },],
    status:{
        type:Boolean,
        default:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user',
       },
},{timestamps:true});
export default models.Donor || model<IDonor>("Donor",DonorSchema);