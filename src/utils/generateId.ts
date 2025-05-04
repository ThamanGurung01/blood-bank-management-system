import { model } from "mongoose";
export const generateId=async(type:string)=>{
if(type==="donor"){
      const count = await model("Donor").countDocuments();
      const date = Math.floor(new Date().getTime() / 1000);
      const donorId = `DON-${date}-${String(count + 1)}`;
      console.log(donorId);
      return donorId;
}else if(type==="bloodRequest"){
      const count = await model("Blood_request").countDocuments();
      const date = Math.floor(new Date().getTime() / 1000);
      const bloodRequestId = `BR-${date}-${String(count + 1)}`;
      console.log(bloodRequestId);
      return bloodRequestId;
}
}