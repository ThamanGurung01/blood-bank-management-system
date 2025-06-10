"use server";

import BloodBank from "@/models/blood_bank.models";
import Donors from "@/models/donor.models";

export const getAdminMetrics = async () => {
  try {
    const [totalBloodBanks, unverifiedBloodBanks, activeDonors] = await Promise.all([
      BloodBank.countDocuments(),
      BloodBank.countDocuments({ verified: false }),
      Donors.countDocuments({ status: true })
    ]);

    const metrics = [
      {
        title: "Total Blood Banks",
        value: totalBloodBanks.toString() || "0",
        description: "Registered blood banks",
        icon: "🏥",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        borderColor: "border-blue-200"
      },
      {
        title: "Total Donors",
        value: activeDonors.toString() || "0",
        description: "Active blood donors",
        icon: "🩸",
        bgColor: "bg-red-50",
        textColor: "text-red-600",
        borderColor: "border-red-200"
      },
      {
        title: "Pending Verifications",
        value: unverifiedBloodBanks.toString() || "0",
        description: "Blood banks awaiting approval",
        icon: "⏳",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600",
        borderColor: "border-yellow-200"
      }
    ];

    return {success:true, data:metrics};
  } catch (error) {
    console.error("Error fetching metrics:", error);
        return {success:false, message:"Error fetching metrics"};

  }
};
