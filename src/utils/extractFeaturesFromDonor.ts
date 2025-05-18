import { IDonor } from "@/models/donor.models";
import {
  getBloodRarityIndex,
  getConsistencyIndex,
  getDonationFrequency,
  getRecencyScore,
  getReliabilityScore
} from "./calculateScore";

export const bloodCompatibility: Record<string, string[]> = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

export const extractFeaturesFromDonor = (
  donor: IDonor,
  recipientBloodGroup: string,
  donationDates: Date[]
): number[] => {
  const normalizedScore = (donor.score ?? 0) / 10000;

  return [
    recipientBloodGroup===donor.blood_group?1:bloodCompatibility[recipientBloodGroup]?.includes(donor.blood_group) ?  1: 0,

    donor.status ? 1 : 0,

    getRecencyScore(donor.last_donation_date),

    getDonationFrequency(donationDates),

    getConsistencyIndex(donationDates),

    getReliabilityScore(donor.unsuccessful_donations ?? 0),

    getBloodRarityIndex(donor.blood_group),

    normalizedScore
  ];
};
