import {Schema,model,models,Document} from "mongoose";
import { DonationType } from "./blood_donation.models";
export type bloodStatus="available"|"used"|"expired";
export interface IBlood extends Document{
    blood_type:string;
    donation_type:DonationType;
    blood_units:string;
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
    donation_type:{
        type:String,
        required:true,
    },
    blood_units:{
        type:String,
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
        enum:["available","used","expired"],
        default:"available",
    },
    blood_bank:{
        type:Schema.Types.ObjectId,
        ref:"blood_bank",
        required:true,
    },
    donor:{
        type:Schema.Types.ObjectId,
        ref:"donor",
        required:true,
    },
})
export default models.Blood || model<IBlood>("Blood",bloodSchema);