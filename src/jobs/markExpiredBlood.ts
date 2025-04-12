import Blood from "../models/blood.models";

export async function markExpiredBloodUnits() {
  const now = new Date();

  await Blood.updateMany(
    { expiryDate: { $lt: now }, status: "available" },
    { $set: { status: "expired" } }
  );
}