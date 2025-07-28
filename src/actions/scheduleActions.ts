"use server";

import BloodBank from "@/models/blood_bank.models";
import Schedule from "@/models/schedule.model";
import { connectToDb } from "@/utils/database";
import { revalidatePath } from "next/cache";

// Create bulk time slots for a blood bank
export async function createTimeSlots(
  bloodBankId: string,
  dates: Date[],
  timeSlots: string[]
) {
  try {
    await connectToDb();

    const bloodBank = await BloodBank.findById(bloodBankId);
    if (!bloodBank) {
      return { success: false, error: "Blood bank not found" };
    }

    const scheduleEntries = [];

    for (const date of dates) {
      for (const timeSlot of timeSlots) {
        // Check if slot already exists
        const existingSlot = await Schedule.findOne({
          blood_bank: bloodBankId,
          date: date,
          time_slot: timeSlot,
        });

        if (!existingSlot) {
          scheduleEntries.push({
            blood_bank: bloodBankId,
            date: date,
            time_slot: timeSlot,
            isBooked: false,
          });
        }
      }
    }

    if (scheduleEntries.length > 0) {
      await Schedule.insertMany(scheduleEntries);
    }

    revalidatePath("/dashboard/schedule-management");

    return {
      success: true,
      message: `Created ${scheduleEntries.length} time slots successfully`,
    };
  } catch (error) {
    console.error("Error creating time slots:", error);
    return { success: false, error: "Failed to create time slots" };
  }
}

// Get schedule overview for a blood bank
export async function getScheduleOverview(
  bloodBankId: string,
  month: number,
  year: number
) {
  try {
    await connectToDb();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const schedules = await Schedule.find({
      blood_bank: bloodBankId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("donor", "donorId blood_group");

    // Group by date
    const scheduleByDate = schedules.reduce((acc, schedule) => {
      const dateKey = schedule.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(schedule);
      return acc;
    }, {} as Record<string, any[]>);

    return { success: true, data: scheduleByDate };
  } catch (error) {
    console.error("Error fetching schedule overview:", error);
    return { success: false, error: "Failed to fetch schedule overview" };
  }
}

// Delete/Remove time slots
export async function removeTimeSlots(
  bloodBankId: string,
  scheduleIds: string[]
) {
  try {
    await connectToDb();

    // Only allow deletion of unbooked slots
    const result = await Schedule.deleteMany({
      _id: { $in: scheduleIds },
      blood_bank: bloodBankId,
      isBooked: false,
    });

    revalidatePath("/dashboard/schedule-management");

    return {
      success: true,
      message: `Removed ${result.deletedCount} time slots successfully`,
    };
  } catch (error) {
    console.error("Error removing time slots:", error);
    return { success: false, error: "Failed to remove time slots" };
  }
}
