import {Schema,model,models,Document} from "mongoose";
export type DonationType="whole_blood"|"rbc"|"platelets"|"plasma"|"cryoprecipitate";
export interface IBLood_Donation extends Document{
    donorId:string;
    donor_name:string;
    donor_contact:string;
    donor_address:string;
    donor_type:string;
    blood_type:string;
    donation_type:DonationType;
    blood_units:string;
    collected_date:Date;
    blood_bank:Schema.Types.ObjectId;
}
const BloodDonationSchema=new Schema<IBLood_Donation>({
donorId:{
    type:String,
    default:"new"
},
donor_name:{
    type:String,
    required:true,
},
donor_contact:{
    type:String,
    required:true,
},
donor_address:{
type:String,
required:true,
},
donor_type:{
    type:String,
    default:"new",
},
blood_bank:{
    type:Schema.Types.ObjectId,
    ref:"blood_bank",
    required:true,
},
})
export default models.Blood_donation || model<IBLood_Donation>("Blood_donation",BloodDonationSchema)