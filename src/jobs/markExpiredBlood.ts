import Blood from "../models/blood.models";

export async function markExpiredBloodUnits() {
  const now = new Date();

  const data=await Blood.updateMany(
    { expiry_date: { $lt: now }, status: "available" },
    { $set: { status: "expired" } }
  );
  return data;
}