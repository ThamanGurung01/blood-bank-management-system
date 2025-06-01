import BloodRequest from "@/models/blood_request.models";
export const rejectBloodRequest=async(brObjectId:string,bloodBankId:string,bloodRequestId:string)=>{
  try {
        const bloodRequestData=await BloodRequest.findOneAndUpdate({_id:brObjectId,bloodRequestId:bloodRequestId,blood_bank:bloodBankId,status:"Rejected",rejectedBy: { $ne: bloodBankId },},
          [{
      $set: {
        rejectedBy: { $concatArrays: ["$rejectedBy", [bloodBankId]] },
        redirected: {
          $cond: {
            if: { $lt: ["$redirected", 5] },
            then: { $add: ["$redirected", 1] },
            else: "$redirected"
          }
        }
      }}]
    ,{new:true}).populate({path:"requestor",populate:{path:"user",model:"User"}}).sort({createdAt:-1});
if(bloodRequestData>=5) return "Blood request has been redirected too many times.";
const newBloodRequestData = bloodRequestData.toObject();
delete newBloodRequestData._id;

const allNearbyBanks = newBloodRequestData.nearby_blood_banks || [];
console.log("allNearbyBanks",allNearbyBanks);
const rejectedBy = newBloodRequestData.rejectedBy || [];
console.log("rejectedBy",rejectedBy);
const nextBloodBank = allNearbyBanks.find((bankId: any) =>
  !bankId.equals(bloodBankId) &&
  !rejectedBy.some((rejected: any) => rejected.equals(bankId))
);
console.log("nextBloodBank",nextBloodBank);
if (!nextBloodBank) {
  return "No nearby blood banks available for redirection.";
}
newBloodRequestData.blood_bank = nextBloodBank;
newBloodRequestData.status = "Pending";
if (newBloodRequestData.requestor?._id) newBloodRequestData.requestor = newBloodRequestData.requestor._id;
const createRedirectedBloodRequest = await BloodRequest.create(newBloodRequestData);

return JSON.parse(JSON.stringify(createRedirectedBloodRequest));
} catch (error:any) {
   console.log("Reject Blood Request Error:", error); 
   return "something went wrong";
}
}