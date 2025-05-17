export const getConsistencyIndex = (donationDates: Date[]):number => {
if (donationDates.length < 3) return 0;

  const sorted = donationDates.sort((a, b) => a.getTime() - b.getTime());
  const intervals = [];
  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    intervals.push(diff);
  }

  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
  const consistency = 1 - Math.min(1, variance / 4000);
  return parseFloat(consistency.toFixed(4));
}
export const getBloodRarityIndex = (bloodGroup: string):number => {
 const bloodRarityMap: { [key: string]: number } = {
    "O+": 0.2,
    "A+": 0.2,
    "B+": 0.15,
    "AB+": 0.1,
    "O-": 0.1,
    "A-": 0.1,
    "B-": 0.075,
    "AB-": 0.05
  };

  const rarity = bloodRarityMap[bloodGroup] ?? 0.2;
  const rarityScore = 1 - rarity;

  return parseFloat(rarityScore.toFixed(4));
}
export const getRecencyScore = (lastDonationDate:Date):number => {
  if (!lastDonationDate) return 0;
  const daysSince = (Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24);
  const recency = Math.max(0, 1 - daysSince / 365);
  return parseFloat(recency.toFixed(4));
}
export const getReliabilityScore = (unsuccessful_donations: number):number => {
  const reliability = Math.max(0, 1 - unsuccessful_donations * 0.1);
  return parseFloat(reliability.toFixed(4));
}
export const getDonationFrequency = (donationDates: Date[]):number => {
if (donationDates.length < 2) return 0;
  const sorted = donationDates.sort((a, b) => a.getTime() - b.getTime());
  const intervals = [];
  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    intervals.push(diff);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const frequency = Math.min(1, 90 / avgInterval);
  return parseFloat(frequency.toFixed(4));
}