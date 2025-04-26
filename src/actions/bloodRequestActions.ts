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
import { getLatLong } from "@/app/api/map/getLatLong";
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
            if (!deliveryAddress) {
                return { success: false, message: "Failed to fetch location data" };
              }
            const bloodRequestData=formDataDeform(formData,"blood_request") as IBlood_Request | undefined;
            if (!bloodRequestData) {
                return { success: false, message: "Request data is invalid" };
            }
            const cBloodRequest=await BloodRequest.create({...bloodRequestData,requestor:donorId,hospitalAddress:{latitude:deliveryAddress?.data?.lat,longitude:deliveryAddress?.data?.lon}});
            console.log("Created Blood Request: ",cBloodRequest);
            if(!cBloodRequest) return {success:false,message:"Failed to create blood request"};
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