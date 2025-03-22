import { model } from "mongoose";
export const generateDonorId=async()=>{
const count = await model("Donor").countDocuments();
      const date = Math.floor(new Date().getTime() / 1000);
      const donorId = `DON-${date}-${String(count + 1)}`;
      console.log(donorId);
      return donorId;
}