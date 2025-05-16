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
    // i have to create a function to get last donation date
    return {success:true,data:JSON.parse(JSON.stringify(donors))};
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}