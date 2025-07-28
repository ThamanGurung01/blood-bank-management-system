export const TIME_SLOTS = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
] as const;

export const DONATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const WAITING_PERIODS = {
  whole_blood: 56, // days
  platelets: 7,
  plasma: 28,
  rbc: 56,
  cryoprecipitate: 56,
} as const;

export function calculateNextEligibleDate(
  lastDonationDate: Date,
  donationType: keyof typeof WAITING_PERIODS
): Date {
  const waitingPeriod = WAITING_PERIODS[donationType] || 56;
  const nextDate = new Date(lastDonationDate);
  nextDate.setDate(nextDate.getDate() + waitingPeriod);
  return nextDate;
}

export function isEligibleToDonate(nextEligibleDate: Date): boolean {
  return new Date() >= nextEligibleDate;
}

export function formatTimeSlot(timeSlot: string): string {
  const [start, end] = timeSlot.split("-");
  return `${start} - ${end}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case DONATION_STATUS.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case DONATION_STATUS.APPROVED:
      return "bg-blue-100 text-blue-800";
    case DONATION_STATUS.COMPLETED:
      return "bg-green-100 text-green-800";
    case DONATION_STATUS.REJECTED:
    case DONATION_STATUS.CANCELLED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function validateDonationRequest(data: {
  donorId: string;
  bloodBankId: string;
  requestedDate: Date;
  timeSlot: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.donorId) errors.push("Donor ID is required");
  if (!data.bloodBankId) errors.push("Blood bank ID is required");
  if (!data.requestedDate) errors.push("Requested date is required");
  if (!data.timeSlot) errors.push("Time slot is required");

  // Check if date is in the future
  if (data.requestedDate && data.requestedDate <= new Date()) {
    errors.push("Requested date must be in the future");
  }

  // Check if time slot is valid
  if (data.timeSlot && !TIME_SLOTS.includes(data.timeSlot as any)) {
    errors.push("Invalid time slot");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
