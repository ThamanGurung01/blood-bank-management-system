import { Schema,Document,model,models } from "mongoose";
export type Role= 'donor' | 'blood_bank' | 'admin';
export interface IDonor extends Document{
   user:Schema.Types.ObjectId;
    location:string;
    contact:number;
}
const DonorSchema=new Schema<IDonor>({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user',
       },
    location:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    }
},{timestamps:true});
export default models.Donor || model<IDonor>("Donor",DonorSchema);