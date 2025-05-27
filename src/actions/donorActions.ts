"use server";
import { connectToDb } from "@/utils/database";
import Donor, { IDonor } from "@/models/donor.models"
import BloodDonation from "@/models/blood_donation.models";
import { bloodCompatibility, extractFeaturesFromDonor } from "@/utils/extractFeaturesFromDonor";
import { cosineSimilarity } from "@/utils/cosineSimilarity";
import { calculateDistance } from "@/utils/calculateDistance";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const getAllDonor=async()=>{
try {
    await connectToDb();
  const donors=await Donor.find({
      status:true,
      next_eligible_donation_date: { $lte: new Date() },
    }).populate({path:"user",
    select:"name email role"
    }).lean();
    if(!donors || donors.length===0) return {success:false,message:"No donors found"};
    
    return {success:true,data:JSON.parse(JSON.stringify(donors))};
    
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}

export const getDonor=async(id:string)=>{
try {
    await connectToDb();
if(!id) return {success:false,message:"Donor ID is required"};
const donor=await Donor.findOne({
      _id:id
    }).populate({path:"user",
    select:"name email role"
    });
    const donorData=donor.toObject();
    if(!donor) return {success:false,message:"Donor not found"};
    const donations = await BloodDonation.find({ donorId: donor.donorId }).populate('blood_bank', 'blood_bank').sort({ collected_date: -1 }).lean();
    if(!donations || donations.length === 0) return {success:true,data:{...donorData, donations: []}};
    const formattedDonations = donations.map((donation, index) => ({id: index + 1,date: donation.collected_date? donation.collected_date.toISOString().split('T')[0]: 'Unknown Date',
  location: donation.blood_bank?.blood_bank || 'Unknown Location',units: donation.blood_units,status: 'completed',}));
  console.log(donations);
    return {success:true,data:JSON.parse(JSON.stringify({...donorData, donations: formattedDonations}))};
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

export const getRecommendedDonors = async (recipientBloodGroup: string) => {
  try {
     const session=await getServerSession(authOptions);
            if(!session) return {success:false,message:"User not authenticated"};
            if(session?.user.role!=="donor") return {success:false,message:"User not authorized"};
            const user=session.user.id;
    await connectToDb();
    const recipient = await Donor.findOne({ _id: user }).populate({path: "user",select: "name email role",}).lean();
    if (!recipient || Array.isArray(recipient)) {
      return {
        success: false,
        message: "Recipient not found",
      };
    }
    const donors = await Donor.find({}).populate({path: "user",select: "name email role",}).lean();
const perfectMatch: any[] = [];
const compatible: any[] = [];
const incompatible: any[] = [];

    const scoredDonors = await Promise.all(
  donors.map(async (donor) => {
    const donations = await BloodDonation.find(
      { donorId: donor._id },
      { collected_date: 1, _id: 0 }
    ).lean();

    const donationDates = donations.map((d) => new Date(d.collected_date));
    const distance = calculateDistance(
      recipient.location.latitude,
      recipient.location.longitude,
      donor.location.latitude,
      donor.location.longitude
    );

    // Skip donors beyond 50km
    if (distance > 50) return;

    const isExactMatch = donor.blood_group === recipientBloodGroup;
    const isCompatible =
      bloodCompatibility[recipientBloodGroup]?.includes(donor.blood_group) || false;

    const baseVector = extractFeaturesFromDonor(
      donor as unknown as IDonor,
      recipientBloodGroup,
      donationDates
    );
    const proximityScore = 1 / (1 + distance);
    const donorVector = [...baseVector, proximityScore];

    const recipientVector = extractFeaturesFromDonor(
      recipient as unknown as IDonor,
      recipientBloodGroup,
      []
    );
    const queryVector = [...recipientVector, 1];

    const similarity = cosineSimilarity(queryVector, donorVector);

    const enrichedDonor = {
      ...donor,
      user: {
  ...donor.user,
  _id: donor.user?._id?.toString?.() || null,
},
      similarity,
      _id: (donor._id as string | { toString(): string }).toString(),
      user_id: donor.user?._id?.toString() || null,
    };

    if (isExactMatch) {
      perfectMatch.push(enrichedDonor);
    } else if (isCompatible) {
      compatible.push(enrichedDonor);
    } else {
      incompatible.push(enrichedDonor);
    }
  })
);

// Sort each group by similarity
perfectMatch.sort((a, b) => b.similarity - a.similarity);
compatible.sort((a, b) => b.similarity - a.similarity);
incompatible.sort((a, b) => b.similarity - a.similarity);

// Merge groups
const finalSorted = [...perfectMatch, ...compatible, ...incompatible];

return {
  success: true,
  data: finalSorted,
};

  } catch (error: any) {
    console.error(error.message);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
