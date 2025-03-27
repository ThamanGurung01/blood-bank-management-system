import {Schema,model,models,Document} from "mongoose";
export type DonationType="whole_blood"|"rbc"|"platelets"|"plasma"|"cryoprecipitate";
export interface IBLood_Donation extends Document{
    donorId:string;
    blood_type:string;
    donation_type:DonationType;
    blood_units:string;
    collected_date:Date;
}
const BloodDonationSchema=new Schema<IBLood_Donation>({
donorId:{
    type:String,
    default:"new"
},
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
})
export default models.blood_donation || model<IBLood_Donation>("blood_donation",BloodDonationSchema)