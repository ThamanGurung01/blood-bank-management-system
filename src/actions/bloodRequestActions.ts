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
import BloodBank from "@/models/blood_bank.models";
import { getLatLong } from "@/app/api/map/getLatLong";
import { getReceivingBloodGroups } from "@/utils/bloodMatch";
import { nearestDistance } from "@/utils/nearestDistance";
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
            const donorData=await Donor.findOne({user});
            if(!donorData) return {success:false,message:"Blood bank not found"};
            const donorId=donorData._id;
            const addressQuery=formData.get("hospitalAddress") as string;
            if(!addressQuery) return {success:false,message:"Hospital Address is required"};
            const deliveryAddress=await getLatLong(addressQuery);
            if (!deliveryAddress?.success) {
                return { success: false, message: "Failed to fetch location data" };
              }
              console.log(deliveryAddress.data)
            const bloodRequestData=formDataDeform(formData,"blood_request") as IBlood_Request | undefined;
            if (!bloodRequestData) {
                return { success: false, message: "Request data is invalid" };
            }
            console.log("blood request :",bloodRequestData);
            console.log("blood_  component: ",bloodRequestData.blood_component)
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
            console.log("Blood stock Data: ",bloodStockData);
            if(bloodStockData.length===0) return {success:false,message:"No blood available"};
            //now also find by nearest location
            const nearestBloodBank=nearestDistance(bloodStockData,deliveryAddress.data);
            console.log(nearestBloodBank.map((b: { blood_bank: { blood_bank: string }; distance: number }) => ({
              name: b.blood_bank.blood_bank,
              distance: b.distance.toFixed(2) + ' km'
            })));
            console.log(nearestBloodBank[0]);
            // const cBloodRequest=await BloodRequest.create({...bloodRequestData,requestor:donorId,hospitalAddress:{latitude:deliveryAddress?.data?.lat,longitude:deliveryAddress?.data?.lon}});
            // console.log("Created Blood Request: ",cBloodRequest);
            // if(!cBloodRequest) return {success:false,message:"Failed to create blood request"};
            return {success:true,message:`Blood request successfully created`}
        }else{
            console.log(errors);
            return {success:false,message:"User validation error"};
        }
    } catch (error:any) {
        console.error("Insert Blood Request Error:", error);
        return {success:false,message:"Something went wrong"}
}
}