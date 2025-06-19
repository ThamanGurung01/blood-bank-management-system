"use server";
import IValidation from "@/types/validationTypes";
import { connectToDb } from "@/utils/database";
import { fromValidation } from "@/utils/validation";
import User, { IUser } from "@/models/user.models"
import Donor, { IDonor } from "@/models/donor.models"
import BloodBank, { IBlood_Bank } from "@/models/blood_bank.models"
import { formDataDeform } from "@/utils/formDataDeform";
import { generateId } from "@/utils/generateId";
import { uploadImage } from "./uploadFileActions";

interface DonorWithProfileImage extends IDonor {
    profilePicture: File;
}
interface BloodBankWithProfileImage extends IBlood_Bank {
    profilePicture: File;
}

export const createUser=async(formData:FormData)=>{
try {
    await connectToDb();
    const validation=fromValidation(formData,"signup");
    const errors: IValidation | undefined = validation?.error?.flatten().fieldErrors;
    if(!errors){
        const existingUser=await User.find({email:formData.get("email")});
        console.log("existing"+existingUser);
        if(existingUser.length>0) return {success:false,message:"user already exists"};
        if(formData.get("role")==="donor"){
            const cUser:IUser=await User.create(formDataDeform(formData,"user"));
            const userId=cUser._id;
            const donorData = formDataDeform(formData,"donor") as DonorWithProfileImage | undefined;
            if (!donorData) {
                return { success: false, message: "Donor data is invalid" };
            }
            const donorId=await generateId("donor");
            if(!donorId) return { success: false, message: "Donor Id is empty" };
            const fileUpload = await uploadImage(donorData?.profilePicture, "donorProfile");
           const cDonor= await Donor.create({
            donorId:donorId,
            user:userId,
            contact:donorData.contact,
            age:donorData.age,
            location:{
                latitude:donorData.location.latitude,
                longitude:donorData.location.longitude,
            },
            blood_group:donorData.blood_group,
            profileImage: fileUpload.success && fileUpload.data ? {
            url: fileUpload.data.secure_url,
            publicId: fileUpload.data.public_id,
            }: undefined,
           });
           const createdUser={...cUser,...cDonor};
           console.log(createdUser);
           return {success:true,message:`User successfully created`}
        }else if(formData.get("role")==="blood_bank"){
            const cUser:IBlood_Bank=await User.create(formDataDeform(formData,"user"));
            const userId=cUser._id;
            const bloodBank= formDataDeform(formData,"blood_bank")as BloodBankWithProfileImage | undefined;
            if (!bloodBank) {
                return { success: false, message: "Blood bank data is invalid" };
            }

            const fileUpload = await uploadImage(bloodBank?.profilePicture, "donorProfile");
           const cBloodBank= await BloodBank.create({
            user:userId,
            blood_bank:bloodBank.blood_bank,
            location:{
                latitude:bloodBank.location.latitude,
                longitude:bloodBank.location.longitude,
            },
            contact:bloodBank.contact,
            profileImage: fileUpload.success && fileUpload.data ? {
            url: fileUpload.data.secure_url,
            publicId: fileUpload.data.public_id,
            }: undefined,
           });
           const createdUser={...cUser,...cBloodBank};
           console.log(cBloodBank+"cblood")
           console.log(createdUser);
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