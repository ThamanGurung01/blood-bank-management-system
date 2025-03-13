import { Schema,Document,model,models } from "mongoose";
export type Role= 'donor' | 'blood_bank' | 'admin';
export interface IDonor extends Document{
    user:Schema.Types.ObjectId;
    blood_group:string;
    age:number;
    location:string;
    contact:string;
    status:boolean;
    donations:Array<{
        bloodBank:Schema.Types.ObjectId;
        date:Date;
    }>;
}
const DonorSchema=new Schema<IDonor>({
    blood_group:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true},
    location:{
        type:String,
        required:true
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