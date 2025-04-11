"use server";
import IValidation from "@/types/validationTypes";
import { connectToDb } from "@/utils/database";
import { fromValidation } from "@/utils/validation";
import BloodDonation, { IBLood_Donation } from "@/models/blood_donation.models"
import { formDataDeform } from "@/utils/formDataDeform";
import Donor from "@/models/donor.models";
export const insertBloodDonation=async(formData:FormData,bloodDonationType:string)=>{
try {
    await connectToDb();
    const validation=fromValidation(formData,bloodDonationType);
    console.log(formData.get("donor_address"));
    const errors: IValidation | undefined = validation?.error?.flatten().fieldErrors;
    if(!errors){
        if(bloodDonationType==="new_blood_donation"){
            const bloodDonationData=formDataDeform(formData,"new_blood_donation") as IBLood_Donation | undefined;
            if (!bloodDonationType) {
                return { success: false, message: "Donation data is invalid" };
            }
            console.log(bloodDonationData);
            const cBloodDonation=await BloodDonation.create(bloodDonationData);
            console.log(cBloodDonation+"blood donation created");
            return {success:true,message:`Blood donation successfully created`}
        }else if(bloodDonationType==="existing_blood_donation"){
            const bloodDonationData=formDataDeform(formData,"existing_blood_donation") as IBLood_Donation | undefined;
            if (!bloodDonationType) {
                return { success: false, message: "Donation data is invalid" };
            }
            console.log(bloodDonationData);
            const existingDonor=await Donor.findOne({donorId:formData?.get("donor_id")}).populate("user");
            console.log(formData?.get("donor_id"));
            console.log("existing donor: "+existingDonor);
            if(!existingDonor) return {success:false,message:"Donor not found"};
            const newBloodDonationData={...bloodDonationData,donor_name:existingDonor.user.name,donor_contact:existingDonor.contact};
            const cBloodDonation=await BloodDonation.create(newBloodDonationData);
            console.log(cBloodDonation+"blood donation created");
            return {success:true,message:`Blood donation successfully created`}
        }
    }else{
        console.log(errors);
        return {success:false,message:"User validation error"};
    }
} catch (error:any) {
    console.log(error?.message);
    return {success:false,message:"Something went wrong"}
}
}