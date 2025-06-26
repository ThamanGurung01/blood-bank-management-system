"use server";
import { connectToDb } from "@/utils/database";
import BloodBank from "@/models/blood_bank.models";
import Blood from "@/models/blood.models";
import User from "@/models/user.models";
import BloodDonation from "@/models/blood_donation.models";
import mongoose, { Types } from "mongoose";
export const getBloodBank = async (bloodBankId: string) => {
  try {
    await connectToDb();
    const bloodBank = await BloodBank.findOne({
      _id: bloodBankId,
    }).populate({
      path: "user",
      select: "name email role"
    }).lean();
    if (!bloodBank || bloodBank.length === 0) return { success: false, message: "No blood bank found" };
    const inventory = await Blood.aggregate([
      {
        $match: {
          status: "available",
          blood_bank: new mongoose.Types.ObjectId(bloodBankId)
        }
      },
      {
        $group: {
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
    return { success: true, data: JSON.parse(JSON.stringify({ ...bloodBank, inventory: inventory ?? [], recentDonations: recentDonations })) };

  } catch (error: any) {
    console.log(error?.message);
    return { success: false, message: "Something went wrong" }
  }
}

export const getAllBloodBanks = async () => {
  try {
    await connectToDb();
    const bloodBanks = await BloodBank.find({}).populate(
      {
        path: "user",
        select: "name email role"
      }).lean().sort({ createdAt: -1 });
    if (!bloodBanks || bloodBanks.length === 0) return { success: false, message: "No Blood Bank found" };

    return { success: true, data: JSON.parse(JSON.stringify(bloodBanks)) };

  } catch (error: any) {
    console.log(error?.message);
    return { success: false, message: "Something went wrong" }
  }
}

export const getVerifiedAllBloodBanks = async () => {
  try {
    await connectToDb();
    const bloodBanks = await BloodBank.find({verified:true}).populate(
      {
        path: "user",
        select: "name email role"
      }).lean().sort({ createdAt: -1 });
    if (!bloodBanks || bloodBanks.length === 0) return { success: false, message: "No Blood Bank found" };

    return { success: true, data: JSON.parse(JSON.stringify(bloodBanks)) };

  } catch (error: any) {
    console.log(error?.message);
    return { success: false, message: "Something went wrong" }
  }
}

export const checkBloodBankVerification = async (bloodBankId: string): Promise<boolean> => {
  try {
    await connectToDb();
    const bloodBanks = await BloodBank.find({ _id: bloodBankId, verified: true });
    if (!bloodBanks || bloodBanks.length === 0) return false;
    return true;

  } catch (error: any) {
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

export const getLatestBloodBank = async (type: string) => {
  if (!["verified", "unverified"].includes(type)) return { success: false, message: "Blood bank not found." };
  const latestBank = await BloodBank.findOne({ verified: type === "verified" }).sort({ createdAt: -1 });
  if (!latestBank) {
    return { success: false, message: "No blood bank found." };
  }
  return { success: true, data: JSON.parse(JSON.stringify(latestBank)) };
}

export const updateBloodBank = async (bloodBankId: string, updatedData: Partial<any>) => {
  try {
    await connectToDb();
    const bloodBank = await BloodBank.findByIdAndUpdate(
      bloodBankId,
      {
        blood_bank:updatedData.blood_bank,
        contact: updatedData.contact,
      },
      { new: true }
    ).populate("user");
    if (updatedData.name || updatedData.password) {
      await User.findByIdAndUpdate(bloodBank.user._id, {
        ...(updatedData.name && { name: updatedData.name }),
        ...(updatedData.password && { password: updatedData.password }),
      });
    }
    const updatedBloodBank = await BloodBank.findById(bloodBankId).populate("user");

    return { success: true, data: JSON.parse(JSON.stringify(updatedBloodBank)) };
  } catch (error) {
    console.error("Update failed:", error);
    return { success: false, message: "Failed to update blood Bank." };
  }
};

export const deleteBloodBank = async (bloodBankId: string) => {
  try {
    if (!Types.ObjectId.isValid(bloodBankId)) {
      return { success: false, message: "Invalid Blood Bank ID." };
    }

    await connectToDb();

    const deleted = await BloodBank.findByIdAndDelete(bloodBankId);
    if (!deleted) {
      return { success: false, message: "Blood Bank not found or already deleted." };
    }
    return { success: true, message: "Blood Bank deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting Blood Bank:", error.message);
    return { success: false, message: "An error occurred while deleting the Blood Bank." };
  }
};