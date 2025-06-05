"use server";
import { connectToDb } from "@/utils/database";
import Donor, { IDonor } from "@/models/donor.models"
import BloodBank from "@/models/blood_bank.models";
import Blood from "@/models/blood.models";
import BloodDonation from "@/models/blood_donation.models";
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
      status: "available"
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