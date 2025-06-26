"use server";
import IValidation from "@/types/validationTypes";
import { connectToDb } from "@/utils/database";
import { fromValidation } from "@/utils/validation";
import User, { IUser } from "@/models/user.models"
import Donor, { IDonor } from "@/models/donor.models"
import BloodBank, { IBlood_Bank } from "@/models/blood_bank.models"
import { formDataDeform } from "@/utils/formDataDeform";
import { generateId } from "@/utils/generateId";

export const createUser=async(formData:FormData)=>{
try {
    await connectToDb();
    const validation=fromValidation(formData,"signup");
    const errors: IValidation | undefined = validation?.error?.flatten().fieldErrors;
    if(!errors){
        const existingUser=await User.find({email:formData.get("email")});
        if(existingUser.length>0) return {success:false,message:"user already exists"};
        if(formData.get("role")==="donor"){
            const cUser:IUser=await User.create(formDataDeform(formData,"user"));
            const userId=cUser._id;
            const donorData = formDataDeform(formData,"donor") as IDonor | undefined;
            if (!donorData) {
                return { success: false, message: "Donor data is invalid" };
            }
            const donorId=await generateId("donor");
            if(!donorId) return { success: false, message: "Donor Id is empty" };
           const cDonor= await Donor.create({
            donorId:donorId,
            user:userId,
            contact:donorData.contact,
            age:donorData.age,
            address:donorData.address,
            location:{
                latitude:donorData.location.latitude,
                longitude:donorData.location.longitude,
            },
            blood_group:donorData.blood_group,
            profileImage: {
            url: donorData.profileImage.url,
            publicId: donorData.profileImage.publicId,
            },
           });
           const createdUser={...cUser,...cDonor};
           return {success:true,message:`User successfully created`}
        }else if(formData.get("role")==="blood_bank"){
            const cUser:IBlood_Bank=await User.create(formDataDeform(formData,"user"));
            const userId=cUser._id;
            const bloodBank= formDataDeform(formData,"blood_bank")as IBlood_Bank | undefined;
            if (!bloodBank) {
                return { success: false, message: "Blood bank data is invalid" };
            }
           const cBloodBank= await BloodBank.create({
            user:userId,
            blood_bank:bloodBank.blood_bank,
            location:{
                latitude:bloodBank.location.latitude,
                longitude:bloodBank.location.longitude,
            },
            address:bloodBank.address,
            contact:bloodBank.contact,
            profileImage: {
            url: bloodBank.profileImage.url,
            publicId: bloodBank.profileImage.publicId,
            },
           });
           const createdUser={...cUser,...cBloodBank};
           return {success:true,message:`User successfully created:`}
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