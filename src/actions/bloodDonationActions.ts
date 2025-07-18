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
import { calculateWeightedScore } from "@/utils/calculateWeightedScore";import { calculateNextEligibleDate } from "@/utils/calculateNextEligibleDate";
4
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
        const bloodBankData=await BloodBank.findOne({_id:user});
        if(!bloodBankData) return {success:false,message:"Blood bank not found"};
        const bloodBankId=bloodBankData._id;
        if(bloodDonationType==="new_blood_donation"){
            const bloodDonationData=formDataDeform(formData,"new_blood_donation") as IBLood_Donation | undefined;
            if (!bloodDonationType) {
                return { success: false, message: "Donation data is invalid" };
            }
            const cBloodDonation=await BloodDonation.create({...bloodDonationData,blood_bank:bloodBankId});
            const bloodExpiryDate=calculateExpiry(bloodDonationData?.donation_type,bloodDonationData?.collected_date);
            const cBlood=await Blood.create({...bloodDonationData,blood_bank:bloodBankId,expiry_date:bloodExpiryDate});
            return {success:true,message:`Blood donation successfully created`}
        }else if(bloodDonationType==="existing_blood_donation"){
            const bloodDonationData=formDataDeform(formData,"existing_blood_donation") as IBLood_Donation | undefined;
            if (!bloodDonationType) {
                return { success: false, message: "Donation data is invalid" };
            }
            const existingDonor=await Donor.findOne({donorId:formData?.get("donor_id")}).populate("user");
            if(!existingDonor) return {success:false,message:"Donor not found"};
            const newBloodDonationData={...bloodDonationData,donor_name:existingDonor.user.name,donor_contact:existingDonor.contact};
            const cBloodDonation=await BloodDonation.create({...newBloodDonationData,blood_bank:bloodBankId,donor_type:"existing"});
            console.log("blood donation data"+JSON.stringify(newBloodDonationData));



           const bloodExpiryDate=calculateExpiry(newBloodDonationData.donation_type,newBloodDonationData.collected_date);
            const cBlood=await Blood.create({...newBloodDonationData,blood_bank:bloodBankId,donor:existingDonor._id,expiry_date:bloodExpiryDate});

            const donations = await BloodDonation.find({ donorId: existingDonor.donorId },{ collected_date: 1, _id: 0 }).lean();
            let donationCount = donations.length;
            let donorScore = existingDonor.score;
            const donationDates = donations.map(d => new Date(d.collected_date));
            donationDates.push(new Date(cBloodDonation.collected_date));
            const calculatedScore = calculateWeightedScore(existingDonor, donationDates);
            donorScore = Math.max(existingDonor.score, calculatedScore);
            console.log(donorScore);
           const blood_collected_date = new Date(cBloodDonation.collected_date);
            const lastDonationDate = existingDonor.last_donation_date ? new Date(existingDonor.last_donation_date) : null;
            const latestDate = !lastDonationDate || blood_collected_date >= lastDonationDate? blood_collected_date: lastDonationDate;


            const nextEligibleDate = calculateNextEligibleDate(blood_collected_date, cBloodDonation.donation_type);
            
            const updated_donated_volume = existingDonor.donated_volume + Number(newBloodDonationData.blood_units);
            const updatedDonorData=await Donor.findByIdAndUpdate(existingDonor._id, {last_donation_date: latestDate,donated_volume:updated_donated_volume,score:donorScore,total_donations:donationCount,next_eligible_donation_date:nextEligibleDate}, { new: true });
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
    const bloodBankData=await BloodBank.findOne({_id:user});
    if(!bloodBankData) return {success:false,message:"Blood bank not found"};
    const bloodBankId=bloodBankData._id;
    await markExpiredBloodUnits();
    const bloodStock=await Blood.find({blood_bank:bloodBankId,blood_type:bloodType,status:"available"}).sort({createdAt:-1});
    if(!bloodStock) return {success:false,message:"Blood stock not found"};
    const bloodStockData=calculateBloodStock(bloodStock);
    return {success:true,message:bloodStockData};
 }  catch(error){
    console.log("error "+error);
 } 
}
export const getBloodDonations=async(id:string)=>{
try {
    if(!id) return {success:false,message:"Blood bank id is invalid"};
    await connectToDb();
    const donorData=await Donor.findOne({_id:id}).populate({path:"user",select:"name email role"})
    if(!donorData) return {success:false,message:"Donor not found"};
    const bloodDonationData=await BloodDonation.find({donorId:donorData.donorId}).populate("blood_bank","blood_bank").sort({collected_date:-1}).lean();
    return {success:true,data:JSON.parse(JSON.stringify(bloodDonationData))};
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}