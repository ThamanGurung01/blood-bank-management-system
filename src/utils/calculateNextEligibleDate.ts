export const calculateNextEligibleDate = (lastDonationDate: Date,donation_type: string): Date => {
  const waitingPeriods: Record<string, number> = {
    whole_blood: 90,      
    rbc: 56,               
    platelets: 7,           
    plasma: 28,             
    cryoprecipitate: 28
  };

  const daysToWait = waitingPeriods[donation_type] || 90;
  const nextDate = new Date(lastDonationDate);
  nextDate.setDate(nextDate.getDate() + daysToWait);

  return nextDate;
};