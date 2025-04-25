"use server";
import { connectToDb } from "@/utils/database";
import { fromValidation } from "@/utils/validation";
import { formDataDeform } from "@/utils/formDataDeform";
import { calculateExpiry } from "@/utils/calculateBloodExpiry";
import Donor from "@/models/donor.models";
import BloodBank from "@/models/blood_bank.models";
import BloodDonation, { IBLood_Donation } from "@/models/blood_donation.models";
import Blood from "@/models/blood.models";
import IValidation from "@/types/validationTypes";
import {getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateBloodStock } from "@/utils/calculateBloodStock";
import { markExpiredBloodUnits } from "@/jobs/markExpiredBlood";
export const insertBloodDonation=async(formData:FormData,bloodDonationType:string)=>{
try {
    const session=await getServerSession(authOptions);
    if(!session) return {success:false,message:"User not authenticated"};
    if(session?.user.role!=="blood_bank") return {success:false,message:"User not authorized"};
    if(!formData) return {success:false,message:"Form data is invalid"};
    if(bloodDonationType!=="new_blood_donation" && bloodDonationType!=="existing_blood_donation") return {success:false,message:"Blood donation type is invalid"};
    await connectToDb();
    const validation=fromValidation(formData,bloodDonationType);
    const errors: IValidation | undefined = validation?.error?.flatten().fieldErrors;
    if(!errors){
        const user=session.user.id;
        const bloodBankData=await BloodBank.findOne({user});
        if(!bloodBankData) return {success:false,message:"Blood bank not found"};
        const bloodBankId=bloodBankData._id;
        if(bloodDonationType==="new_blood_donation"){
            const bloodDonationData=formDataDeform(formData,"new_blood_donation") as IBLood_Donation | undefined;
            if (!bloodDonationType) {
                return { success: false, message: "Donation data is invalid" };
            }
            const cBloodDonation=await BloodDonation.create({...bloodDonationData,blood_bank:bloodBankId});
            return {success:true,message:`Blood donation successfully created`}
        }else if(bloodDonationType==="existing_blood_donation"){
            const bloodDonationData=formDataDeform(formData,"existing_blood_donation") as IBLood_Donation | undefined;
            if (!bloodDonationType) {
                return { success: false, message: "Donation data is invalid" };
            }
            const existingDonor=await Donor.findOne({donorId:formData?.get("donor_id")}).populate("user");
            if(!existingDonor) return {success:false,message:"Donor not found"};
            const newBloodDonationData={...bloodDonationData,donor_name:existingDonor.user.name,donor_contact:existingDonor.contact};
            const cBloodDonation=await BloodDonation.create({...newBloodDonationData,blood_bank:bloodBankId});
            // const uDonor=await Donor.findByIdAndUpdate(existingDonor._id,{$push:{donations:{bloodBank:bloodBankId,bloodDonation:cBloodDonation._id,date:newBloodDonationData.collected_date}}},{new:true});
           const bloodExpiryDate=calculateExpiry(newBloodDonationData.donation_type,newBloodDonationData.collected_date);
            const cBlood=await Blood.create({...newBloodDonationData,blood_bank:bloodBankId,donor:existingDonor._id,expiry_date:bloodExpiryDate});
           return {success:true,message:`Blood donation successfully created`};
        }
    }else{
        console.log(errors);
        return {success:false,message:"User validation error"};
    }
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}
export const getBloodStock=async(bloodType:string)=>{
 try{
    if(!bloodType) return {success:false,message:"Blood type is invalid"};
    const session=await getServerSession(authOptions);
    if(!session) return {success:false,message:"User not authenticated"};
    if(session?.user.role!=="blood_bank") return {success:false,message:"User not authorized"};
    const user=session.user.id;
    await connectToDb();
    const bloodBankData=await BloodBank.findOne({user});
    if(!bloodBankData) return {success:false,message:"Blood bank not found"};
    const bloodBankId=bloodBankData._id;
    await markExpiredBloodUnits();
    const bloodStock=await Blood.find({blood_bank:bloodBankId,blood_type:bloodType,status:"available"}).sort({createdAt:-1});
    if(!bloodStock) return {success:false,message:"Blood stock not found"};
    const bloodStockData=calculateBloodStock(bloodStock);
    // console.log(bloodStockData);
    return {success:true,message:bloodStockData};
 }  catch(error){
    console.log("error "+error);
 } 
}