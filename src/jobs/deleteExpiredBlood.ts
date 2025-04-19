import Blood from "../models/blood.models";

export async function deleteExpiredBloodUnits() {
  const data=await Blood.deleteMany(
    {status: "expired" },
  );
  return data;
}