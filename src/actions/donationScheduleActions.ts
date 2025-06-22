"use server";

import { connectToDb } from "@/utils/database";
import DonationRequest from "@/models/DonationRequest.model";
import Schedule from "@/models/schedule.model";
import Donor from "@/models/donor.models";
import BloodBank from "@/models/blood_bank.models";
import { revalidatePath } from "next/cache";

// Types for better type safety
interface CreateDonationRequestData {
  donorId: string;
  bloodBankId: string;
  requestedDate: Date;
  timeSlot: string;
}

interface UpdateDonationRequestData {
  requestId: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
  newDate?: Date;
  newTimeSlot?: string;
}

// Create a new donation request (Donor side)
export async function createDonationRequest(data: CreateDonationRequestData) {
  try {
    await connectToDb();

    const { donorId, bloodBankId, requestedDate, timeSlot } = data;

    // Validate donor exists and is eligible
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return { success: false, error: "Donor not found" };
    }

    // Check if donor is eligible (not within waiting period)
    const now = new Date();
    if (
      donor.next_eligible_donation_date &&
      new Date(donor.next_eligible_donation_date) > now
    ) {
      return {
        success: false,
        error: `You are not eligible to donate until ${new Date(
          donor.next_eligible_donation_date
        ).toLocaleDateString()}`,
      };
    }

    // Check if blood bank exists
    const bloodBank = await BloodBank.findById(bloodBankId);
    if (!bloodBank) {
      return { success: false, error: "Blood bank not found" };
    }

    // Check if the requested time slot is available
    const existingSchedule = await Schedule.findOne({
      blood_bank: bloodBankId,
      date: requestedDate,
      time_slot: timeSlot,
      isBooked: true,
    });

    if (existingSchedule) {
      return { success: false, error: "This time slot is already booked" };
    }

    // Check if donor already has a pending request for the same date
    const existingRequest = await DonationRequest.findOne({
      donor: donorId,
      requested_date: requestedDate,
      status: "pending",
    });

    if (existingRequest) {
      return {
        success: false,
        error: "You already have a pending request for this date",
      };
    }

    // Create the donation request
    const donationRequest = new DonationRequest({
      donor: donorId,
      blood_bank: bloodBankId,
      requested_date: requestedDate,
      scheduled_time_slot: timeSlot,
      status: "pending",
    });

    await donationRequest.save();

    // Create a temporary schedule entry (not booked until approved)
    const schedule = new Schedule({
      blood_bank: bloodBankId,
      date: requestedDate,
      time_slot: timeSlot,
      isBooked: false,
      donor: donorId,
    });

    await schedule.save();

    revalidatePath("/dashboard/donation-schedule");
    revalidatePath("/dashboard/donation-history");

    return {
      success: true,
      data: donationRequest,
      message: "Donation request submitted successfully",
    };
  } catch (error) {
    console.error("Error creating donation request:", error);
    return { success: false, error: "Failed to create donation request" };
  }
}

// Get donation requests for a donor
export async function getDonorDonationRequests(donorId: string) {
  try {
    await connectToDb();

    const requests = await DonationRequest.find({ donor: donorId })
      .populate("blood_bank", "blood_bank location contact")
      .sort({ createdAt: -1 });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching donor donation requests:", error);
    return { success: false, error: "Failed to fetch donation requests" };
  }
}

// Get donation requests for a blood bank
export async function getBloodBankDonationRequests(
  bloodBankId: string,
  status?: string
) {
  try {
    await connectToDb();

    const filter: any = { blood_bank: bloodBankId };
    if (status && status !== "all") {
      filter.status = status;
    }

    const requests = await DonationRequest.find(filter)
      .populate("donor", "donorId blood_group age contact profileImage")
      .populate("donor.user", "name email")
      .sort({ createdAt: -1 });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching blood bank donation requests:", error);
    return { success: false, error: "Failed to fetch donation requests" };
  }
}

// Update donation request status (Blood bank side)
export async function updateDonationRequestStatus(
  data: UpdateDonationRequestData
) {
  try {
    await connectToDb();

    const { requestId, status, rejectionReason, newDate, newTimeSlot } = data;

    const donationRequest = await DonationRequest.findById(requestId)
      .populate("donor")
      .populate("blood_bank");

    if (!donationRequest) {
      return { success: false, error: "Donation request not found" };
    }

    if (donationRequest.status !== "pending") {
      return {
        success: false,
        error: "This request has already been processed",
      };
    }

    if (status === "approved") {
      const finalDate = newDate || donationRequest.requested_date;
      const finalTimeSlot = newTimeSlot || donationRequest.scheduled_time_slot;

      // Check if the time slot is still available
      const conflictingSchedule = await Schedule.findOne({
        blood_bank: donationRequest.blood_bank,
        date: finalDate,
        time_slot: finalTimeSlot,
        isBooked: true,
        donor: { $ne: donationRequest.donor },
      });

      if (conflictingSchedule) {
        return {
          success: false,
          error: "The selected time slot is no longer available",
        };
      }

      // Update or create the schedule entry
      await Schedule.findOneAndUpdate(
        {
          blood_bank: donationRequest.blood_bank,
          date: finalDate,
          time_slot: finalTimeSlot,
          donor: donationRequest.donor,
        },
        {
          blood_bank: donationRequest.blood_bank,
          date: finalDate,
          time_slot: finalTimeSlot,
          isBooked: true,
          donor: donationRequest.donor,
        },
        { upsert: true }
      );

      // Update the donation request
      donationRequest.status = "approved";
      donationRequest.requested_date = finalDate;
      donationRequest.scheduled_time_slot = finalTimeSlot;
    } else if (status === "rejected") {
      donationRequest.status = "rejected";
      donationRequest.rejection_reason =
        rejectionReason || "No reason provided";

      // Remove the temporary schedule entry
      await Schedule.findOneAndDelete({
        blood_bank: donationRequest.blood_bank,
        date: donationRequest.requested_date,
        time_slot: donationRequest.scheduled_time_slot,
        donor: donationRequest.donor,
        isBooked: false,
      });
    }

    await donationRequest.save();

    revalidatePath("/dashboard/donation-requests");
    revalidatePath("/dashboard/donation-schedule");

    return {
      success: true,
      data: donationRequest,
      message: `Donation request ${status} successfully`,
    };
  } catch (error) {
    console.error("Error updating donation request status:", error);
    return {
      success: false,
      error: "Failed to update donation request status",
    };
  }
}

// Get available time slots for a specific date and blood bank
export async function getAvailableTimeSlots(bloodBankId: string, date: Date) {
  try {
    await connectToDb();

    // Define all possible time slots
    const allTimeSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
    ];

    // Get booked time slots for the date
    const bookedSlots = await Schedule.find({
      blood_bank: bloodBankId,
      date: date,
      isBooked: true,
    }).select("time_slot");

    const bookedTimeSlots = bookedSlots.map((slot) => slot.time_slot);

    // Filter out booked slots
    const availableSlots = allTimeSlots.filter(
      (slot) => !bookedTimeSlots.includes(slot)
    );

    return { success: true, data: availableSlots };
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    return { success: false, error: "Failed to fetch available time slots" };
  }
}

// Get scheduled appointments for a blood bank (for calendar view)
export async function getBloodBankSchedule(
  bloodBankId: string,
  startDate?: Date,
  endDate?: Date
) {
  try {
    await connectToDb();

    const filter: any = {
      blood_bank: bloodBankId,
      isBooked: true,
    };

    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const schedules = await Schedule.find(filter)
      .populate("donor", "donorId blood_group age contact profileImage")
      .populate("donor.user", "name email")
      .sort({ date: 1, time_slot: 1 });

    return { success: true, data: schedules };
  } catch (error) {
    console.error("Error fetching blood bank schedule:", error);
    return { success: false, error: "Failed to fetch schedule" };
  }
}

// Cancel a donation request (Donor side)
export async function cancelDonationRequest(
  requestId: string,
  donorId: string
) {
  try {
    await connectToDb();

    const donationRequest = await DonationRequest.findOne({
      _id: requestId,
      donor: donorId,
    });

    if (!donationRequest) {
      return { success: false, error: "Donation request not found" };
    }

    if (donationRequest.status === "completed") {
      return { success: false, error: "Cannot cancel a completed donation" };
    }

    // Update request status
    donationRequest.status = "rejected";
    await donationRequest.save();

    // Remove the schedule entry
    await Schedule.findOneAndDelete({
      blood_bank: donationRequest.blood_bank,
      date: donationRequest.requested_date,
      time_slot: donationRequest.scheduled_time_slot,
      donor: donorId,
    });

    revalidatePath("/dashboard/donation-schedule");
    revalidatePath("/dashboard/donation-history");

    return {
      success: true,
      message: "Donation request cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling donation request:", error);
    return { success: false, error: "Failed to cancel donation request" };
  }
}

// Mark donation as completed (Blood bank side)
export async function completeDonation(requestId: string, bloodBankId: string) {
  try {
    await connectToDb();

    const donationRequest = await DonationRequest.findOne({
      _id: requestId,
      blood_bank: bloodBankId,
      status: "approved",
    }).populate("donor");

    if (!donationRequest) {
      return { success: false, error: "Approved donation request not found" };
    }

    // Update request status
    donationRequest.status = "completed";
    await donationRequest.save();

    // Update donor's last donation date and next eligible date
    const donor = donationRequest.donor;
    console.log("donorRequest", donationRequest);
    const donationDate = new Date();

    // Calculate next eligible date (56 days for whole blood)
    const nextEligibleDate = new Date(donationDate);
    nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);

    await Donor.findByIdAndUpdate(donor, {
      last_donation_date: donationDate,
      next_eligible_donation_date: nextEligibleDate,
      $inc: { total_donations: 1 },
    });

    revalidatePath("/dashboard/donation-requests");
    revalidatePath("/dashboard/donation-schedule");

    return {
      success: true,
      message: "Donation marked as completed successfully",
    };
  } catch (error) {
    console.error("Error completing donation:", error);
    return { success: false, error: "Failed to complete donation" };
  }
}

// Get donation statistics for blood bank dashboard
export async function getDonationStatistics(bloodBankId: string) {
  try {
    await connectToDb();

    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      completedDonations,
      todayScheduled,
    ] = await Promise.all([
      DonationRequest.countDocuments({ blood_bank: bloodBankId }),
      DonationRequest.countDocuments({
        blood_bank: bloodBankId,
        status: "pending",
      }),
      DonationRequest.countDocuments({
        blood_bank: bloodBankId,
        status: "approved",
      }),
      DonationRequest.countDocuments({
        blood_bank: bloodBankId,
        status: "completed",
      }),
      Schedule.countDocuments({
        blood_bank: bloodBankId,
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        isBooked: true,
      }),
    ]);

    return {
      success: true,
      data: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        completedDonations,
        todayScheduled,
      },
    };
  } catch (error) {
    console.error("Error fetching donation statistics:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}
