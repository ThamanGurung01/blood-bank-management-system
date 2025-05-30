"use server"
import { authOptions } from "@/lib/auth";
import IValidation from "@/types/validationTypes";
import { connectToDb } from "@/utils/database";
import { fromValidation } from "@/utils/validation";
import { getServerSession } from "next-auth";
import Donor from "@/models/donor.models";
import { IBlood_Request } from "@/models/blood_request.models";
import { formDataDeform } from "@/utils/formDataDeform";
import BloodRequest from "@/models/blood_request.models";
import Blood from "@/models/blood.models";
import "@/models/blood_bank.models";
import { getLatLong } from "@/app/api/map/getLatLong";
import { getReceivingBloodGroups } from "@/utils/bloodMatch";
import { nearestDistance } from "@/utils/nearestDistance";
import { generateId } from "@/utils/generateId";
import { rejectBloodRequest } from "@/utils/rejectBloodRequest";
export const insertBloodRequest=async(formData:FormData)=>{
    try {
        const session=await getServerSession(authOptions);
        if(!session) return {success:false,message:"User not authenticated"};
        if(session?.user.role!=="donor") return {success:false,message:"User not authorized"};
        if(!formData) return {success:false,message:"Form data is invalid"};
        await connectToDb();
        const validation=fromValidation(formData,"blood_request");
        const errors: IValidation | undefined = validation?.error?.flatten().fieldErrors;
        if(!errors){
            const user=session.user.id;
            const addressQuery=formData.get("hospitalAddress") as string;
            if(!addressQuery) return {success:false,message:"Hospital Address is required"};
            const deliveryAddress=await getLatLong(addressQuery);
            if (!deliveryAddress?.success) {
                return { success: false, message: "Failed to fetch location data" };
              }
            const bloodRequestData=formDataDeform(formData,"blood_request") as IBlood_Request | undefined;
            if (!bloodRequestData) {
                return { success: false, message: "Request data is invalid" };
            }
            const matchingBloodGroups=getReceivingBloodGroups(bloodRequestData.blood_group);
            if(!matchingBloodGroups) return {success:false,message:"Invalid blood group"};
            const bloodStockData = await Blood.aggregate([
              {
                $match: {
                  status: "available",
                  blood_type: { $in: matchingBloodGroups },
                  donation_type: bloodRequestData.blood_component,
                  expiry_date: { $gte: bloodRequestData.requestDate },
                }
              },
              {
                $group: {
                  _id: "$blood_bank",
                  totalUnits: { $sum: "$blood_units" },
                  bloodIds: { $push: "$_id" }
                }
              },
              {
                $match: {
                  totalUnits: { $gte: bloodRequestData.blood_quantity }
                }
              },
              {
                $lookup: {
                  from: "blood_banks",
                  localField: "_id",
                  foreignField: "_id",
                  as: "blood_bank"
                }
              },
              {
                $unwind: "$blood_bank"
              }
            ]);
            // console.log("Blood Stock Data: ",bloodStockData);
            if(bloodStockData.length===0) return {success:false,message:"No blood available"};
            const nearestBloodBank=nearestDistance(bloodStockData,deliveryAddress.data,bloodRequestData.priorityLevel);
            // console.log(nearestBloodBank.map((b: { blood_bank: { blood_bank: string }; distance: number }) => ({
            //   name: b.blood_bank.blood_bank,
            //   distance: b.distance.toFixed(2) + ' km'
            // })));
            // console.log(nearestBloodBank[0]);
            const BloodRequestId=await generateId("bloodRequest");
            const cBloodRequest=await BloodRequest.create({...bloodRequestData,bloodRequestId:BloodRequestId,requestor:user,address:addressQuery,hospitalAddress:{latitude:deliveryAddress?.data?.lat,longitude:deliveryAddress?.data?.lon},blood_bank:nearestBloodBank[0]._id,nearby_blood_banks:nearestBloodBank});
            // console.log("Created Blood Request: ",cBloodRequest);
            if(!cBloodRequest) return {success:false,message:"Failed to create blood request"};
            return {success:true,message:`Blood request successfully created`,data:JSON.parse(JSON.stringify({
              ...cBloodRequest.toObject(),
              bloodBankName: nearestBloodBank[0].blood_bank.blood_bank,
            }))};
        }else{
            console.log(errors);
            return {success:false,message:"User validation error"};
        }
    } catch (error:any) {
        console.log("Insert Blood Request Error:", error);
        return {success:false,message:"Something went wrong"}


}
}
export const getBloodRequest=async()=>{
  try {
      const session=await getServerSession(authOptions);
      if(!session) return {success:false,message:"User not authenticated"};
      if(session?.user.role !== "donor" && session?.user.role !== "blood_bank") return {success:false,message:"User not authorized"};
      await connectToDb();
      const user=session.user.id;
if(session?.user.role==="donor"){
  const bloodRequestData=await BloodRequest.find({requestor:user}).populate("blood_bank").sort({createdAt:-1});
      if(!bloodRequestData) return {success:false,message:"No blood request found"};
      return {success:true,message:"Blood request fetched successfully",data:JSON.parse(JSON.stringify(bloodRequestData))};
}else if(session?.user.role==="blood_bank"){
  const bloodRequestData=await BloodRequest.find({blood_bank:user}).sort({createdAt:-1}).populate({path:"requestor",populate:{path:"user",model:"User"}}).sort({createdAt:-1});
      if(!bloodRequestData) return {success:false,message:"No blood request found"};
      return {success:true,message:"Blood request fetched successfully",data:JSON.parse(JSON.stringify(bloodRequestData))};
}else{
  return {success:false,message:"User not authorized"};

}
      
  } catch (error:any) {
      console.log("Insert Blood Request Error:", error);
      return {success:false,message:"Something went wrong"}
}
}
export const changeBloodRequestStatus=async(bloodRequestId:string,statusChange:string)=>{
  try {
    const statusType=["Pending","Approved","Rejected","Completed"];
    const session=await getServerSession(authOptions);
    if(!session) return {success:false,message:"User not authenticated"};
    if(session?.user.role!=="blood_bank") return {success:false,message:"User not authorized"};
    if(!bloodRequestId||!statusChange) return {success:false,message:"data is invalid"};
    if(!statusType.includes(statusChange)) return {success:false,message:"Invalid status type"};
    await connectToDb();
        const bloodBankId=session.user.id;
        const bloodRequestData=await BloodRequest.findOneAndUpdate({blood_bank:bloodBankId,bloodRequestId:bloodRequestId},{status:statusChange},{new:true}).populate({path:"requestor",populate:{path:"user",model:"User"}}).sort({createdAt:-1});
      if(!bloodRequestData) return {success:false,message:"No blood request found"};
      if(statusChange==="Rejected") {
        console.log("inside rejected condn")
      const response=await rejectBloodRequest(bloodBankId,bloodRequestId);
       return {success:true,message:"Blood request updated successfully",data:response};
        }else{
     return {success:true,message:"Blood request updated successfully",data:JSON.parse(JSON.stringify(bloodRequestData))};
     }
      
} catch (error:any) {
    console.log("Change status Blood Request Error:", error);
    return {success:false,message:"Something went wrong"}
}
}

export const getUserBloodRequest=async(id:string)=>{
  try {
      const session=await getServerSession(authOptions);
      if(!session) return {success:false,message:"User not authenticated"};
      if(session?.user.role !== "donor" && session?.user.role !== "blood_bank") return {success:false,message:"User not authorized"};
      await connectToDb();
      const user=session.user.id;
      const bloodRequestData=await BloodRequest.findOne({bloodRequestId:id}).populate("blood_bank");
      if(!bloodRequestData) return {success:false,message:"No blood request found"};
      return {success:true,message:"Blood request fetched successfully",data:JSON.parse(JSON.stringify(bloodRequestData))};
      
  } catch (error:any) {
      console.log("Insert Blood Request Error:", error);
      return {success:false,message:"Something went wrong"}
}
}