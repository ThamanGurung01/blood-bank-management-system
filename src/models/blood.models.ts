import {Schema,model,models,Document} from "mongoose";
import { DonationType } from "./blood_donation.models";
export type bloodStatus="available"|"used"|"hold"|"expired";
export interface IBlood extends Document{
    blood_type:string;
    donation_type:DonationType;
    blood_units:number;
    collected_date:Date;
    expiry_date:Date;
    status:bloodStatus;
    blood_bank:Schema.Types.ObjectId;
    donor:Schema.Types.ObjectId;
}
const bloodSchema=new Schema<IBlood>({
    blood_type:{
        type:String,
        required:true,
    },
    donation_type: { type: String, enum: ["whole_blood","rbc","platelets","plasma","cryoprecipitate"], required: true },
    blood_units:{
        type:Number,
        required:true,
    },
    collected_date:{
        type:Date,
        required:true,
    },
    expiry_date:{
        type:Date,
        required:true,
    },
    status:{
        type:String,
        enum:["available","used","hold","expired"],
        default:"available",
    },
    blood_bank:{
        type:Schema.Types.ObjectId,
        ref:"Blood_bank",
        required:true,
    },
    donor:{
        type:Schema.Types.ObjectId,
        ref:"Donor",
        required:true,
    },
})
export default models.Blood || model<IBlood>("Blood",bloodSchema);