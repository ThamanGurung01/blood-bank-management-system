"use server";
import IValidation from "@/types/validationTypes";
import { connectToDb } from "@/utils/database";
import { fromValidation } from "@/utils/validation";
import User, { IUser } from "@/models/user.models"
import Donor, { IDonor } from "@/models/donor.models"
import BloodBank, { IBlood_Bank } from "@/models/blood_bank.models"

export const getDonor=async()=>{
try {
    await connectToDb();
    const donors=await Donor.find({}).populate({path:"user",
    select:"name email role"
    }).lean();

    return {success:true,data:JSON.parse(JSON.stringify(donors))};
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}

export const getDonorRank=async()=>{
try {
    await connectToDb();
    const donors=await Donor.find({}).populate({path:"user",
    select:"name email role"
    }).lean();
    const sortedDonors = donors.sort((a, b) => b.score - a.score);
    const rankedDonors = sortedDonors.map((donor, index) => ({
      ...donor,
      rank: index + 1,
    }));
    return {
      success: true,
      data: JSON.parse(JSON.stringify(rankedDonors)),
    };
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}