import { Schema,Document,model,models } from "mongoose";
export type Role= 'donor' | 'blood_bank' | 'admin';
export interface IDonor extends Document{
    user:Schema.Types.ObjectId;
    donorId:string;
    blood_group:string;
    age:number;
    location:{
        latitude:number;
        longitude:number;
    };
    contact:string;
    status:boolean;
    last_donation_date:Date;
    donated_volume:number;
    weighted_score:number;
    unsuccessful_donations:number;
    score?:number;
}
const DonorSchema=new Schema<IDonor>({
    donorId: { type: String, unique: true },
    blood_group:{
        type:String,
        required:true
    },
    age:{
        type:Number,
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
    status:{
        type:Boolean,
        default:true
    },
    weighted_score:{
        type:Number,
        default:0
    },
    last_donation_date:{
    type:Date,
    },
    donated_volume:{
        type:Number,
        default:0
    },
    unsuccessful_donations:{
        type:Number,
        default:0
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
       },
},{timestamps:true});
export default models.Donor || model<IDonor>("Donor",DonorSchema);