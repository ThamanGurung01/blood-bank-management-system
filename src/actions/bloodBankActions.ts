"use server";
import { connectToDb } from "@/utils/database";
import Donor, { IDonor } from "@/models/donor.models"
import BloodBank from "@/models/blood_bank.models";
import BloodDonation from "@/models/blood_donation.models";
import { getBloodStock } from "./bloodDonationActions";
export const getBloodBank=async(bloodBankId:string)=>{
try {
    await connectToDb();
  const bloodBank=await BloodBank.findOne({
      _id:bloodBankId,
    }).populate({path:"user",
    select:"name email role"
    }).lean();
    if(!bloodBank || bloodBank.length===0) return {success:false,message:"No blood bank found"};
    const bloodStock= await getBloodStock("A+");
    console.log("blood stock"+JSON.stringify(bloodStock));
    return {success:true,data:JSON.parse(JSON.stringify(bloodBank))};
    
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}