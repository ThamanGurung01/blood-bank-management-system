"use server";
import { connectToDb } from "@/utils/database";
import BloodBank from "@/models/blood_bank.models";
import Blood from "@/models/blood.models";
import BloodDonation from "@/models/blood_donation.models";
import mongoose from "mongoose";
export const getBloodBank=async(bloodBankId:string)=>{
try {
    await connectToDb();
  const bloodBank=await BloodBank.findOne({
      _id:bloodBankId,
    }).populate({path:"user",
    select:"name email role"
    }).lean();
    if(!bloodBank || bloodBank.length===0) return {success:false,message:"No blood bank found"};
    const inventory = await Blood.aggregate([
  {
    $match: {
      status: "available",
      blood_bank:new mongoose.Types.ObjectId(bloodBankId)
    }
    },
   {$group: {
      _id: {
        blood_group: "$blood_type",
        status: "$status"
      },
      units: { $sum: "$blood_units" }
    }
  },
  {
    $project: {
      _id: 0,
      blood_group: "$_id.blood_group",
      status: "$_id.status",
      units: 1
    }
  }
]);
const rawDonations = await BloodDonation.find({ blood_bank: bloodBankId })
  .sort({ collected_date: -1 })
  .exec();

const recentDonations = rawDonations.map((donation, index) => ({
  id: index + 1,
  date: donation.collected_date.toISOString().split("T")[0], // YYYY-MM-DD
  donor: donation.donor_name,
  blood_group: donation.blood_type,
  units: donation.blood_units,
}));
    return {success:true,data:JSON.parse(JSON.stringify({...bloodBank,inventory:inventory??[],recentDonations:recentDonations}))};
    
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}

export const getAllBloodBanks=async()=>{
try {
    await connectToDb();
  const bloodBanks=await BloodBank.find({}).populate(
    {
    path:"user",
    select:"name email role"
    }).lean().sort({createdAt:-1});
    if(!bloodBanks || bloodBanks.length===0) return {success:false,message:"No Blood Bank found"};
    
    return {success:true,data:JSON.parse(JSON.stringify(bloodBanks))};
    
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}

export const checkBloodBankVerification = async (bloodBankId: string): Promise<boolean> => {
try {
    await connectToDb();
  const bloodBanks=await BloodBank.find({_id:bloodBankId,verified:true});
    if(!bloodBanks || bloodBanks.length===0) return false;
    return true;
    
} catch (error:any) {
    console.log(error?.message);
    return false;
}
}

export const changeBloodBankVerification = async (bloodBankId: string, verified: boolean) => {
  try {
    await connectToDb();

    const updatedBloodBank = await BloodBank.findByIdAndUpdate(
      { _id: bloodBankId },
      { $set: { verified: verified } },
      { new: true }
    );

    if (!updatedBloodBank) {
      return { success: false, message: "Blood bank not found." };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedBloodBank)),
    };
  } catch (error: any) {
    console.error("Verification update failed:", error?.message);
    return { success: false, message: "An error occurred." };
  }
};