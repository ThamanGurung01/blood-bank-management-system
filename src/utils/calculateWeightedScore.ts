import { IDonor } from "@/models/donor.models";
import { getBloodRarityIndex, getConsistencyIndex, getDonationFrequency, getRecencyScore, getReliabilityScore } from "./calculateScore";

export const calculateWeightedScore = (donor:IDonor ,donationDates:Date[])=>{
    const frequency = getDonationFrequency(donationDates);
  const consistency = getConsistencyIndex(donationDates);
  const rarity = getBloodRarityIndex(donor.blood_group);
  const recency = getRecencyScore(donor.last_donation_date);
  const reliability = getReliabilityScore(donor.unsuccessful_donations);
  const w = {
    freq: 0.25,
    cons: 0.2,
    rarity: 0.2,
    recency: 0.15,
    reliab: 0.1,
  };

  return (
    w.freq * frequency +
    w.cons * consistency +
    w.rarity * rarity +
    w.recency * recency +
    w.reliab * reliability
  );
}