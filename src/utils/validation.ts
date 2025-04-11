import {z} from "zod";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const baseSchema=z.object({
email:z.string().min(1,"Email is required").email("Invalid email format"),
password:z.string().min(6,"Password must be at least 6 characters"),
})
const signupSchema=baseSchema.extend({
  name:z.string().min(3,"Full Name must be at least 3 characters"),
  role:z.enum(["","donor","blood_bank"]).refine((val) => val !== "", { message: "Role is required" }),
  contact:z.string()
  .length(10, "Contact number must be exactly 10 digits")
  .regex(/^98\d{8}$|^97\d{8}$/, "Contact number must start with 98 or 97"),
  location:z.object({
    latitude:z.number().min(1,"Location is Required"),
    longitude:z.number().min(1,"Location is Required"),
  }),
  profile_picture: z
  .any()
  .refine((file) => file.size > 0, {
    message: "Profile picture is required",
  })
  .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, {
    message: "Image must be less than 2MB",
  })
  .refine((file) => file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only .jpg, .jpeg, .png formats are allowed",
  }),
})

const donorSchema=signupSchema.extend({
  age:z.preprocess((val)=>(val!==""?typeof val === "string" ? Number(val) : val:undefined),
  z.number({
    required_error: "Age is required",
  }).min(18,"Age must be at least 18").max(65,"Age must not exceed 65")),
  blood_group:z.enum(["","A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]).refine((val) => val !== "", { message: "Blood Group is required" }),
})
const bloodBankSchema=signupSchema.extend({
  blood_bank:z.string().min(3,"Blood bank name must be at least 3 characters"),
})

const bloodDonationSchema=z.object({
  blood_type:z.enum(["","A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]).refine((val) => val !== "", { message: "Blood Type is required" }),
  donation_type:z.enum(["","whole_blood", "rbc", "platelets", "plasma", "cryoprecipitate"]).refine((val) => val !== "", { message: "Donation Type is required" }),
  blood_quantity:z.preprocess((val)=>(val!==""?typeof val === "string" ? Number(val) : val:undefined),z.number({
    required_error: "Quantity is required",
  }).min(1,"Quantity must be at least 1")),
  collected_date:z.string().min(1,"Date is Required"),
  donor_address:z.string().min(1,"Donor Address is Required"),
});
const existingBloodDonationSchema=bloodDonationSchema.extend({
  donor_id:z.string().min(1,"Donor Id is Required"),
})
const newBloodDonationSchema=bloodDonationSchema.extend({
  donor_name:z.string().min(1,"Donor Name is Required"),
  donor_contact:z.string()
  .length(10, "Contact number must be exactly 10 digits")
  .regex(/^98\d{8}$|^97\d{8}$/, "Contact number must start with 98 or 97"),
})
export const fromValidation = (formData:FormData,type:string) => {
  const formObject: Record<string, any> = Object.fromEntries(formData);
if(type === 'login'){
  formObject.location = JSON.parse(formData.get("location") as string);
return baseSchema.safeParse(formObject);
}else if(type==="signup"){
  formObject.location = JSON.parse(formData.get("location") as string);
  if(formObject.role==="donor"){
    return donorSchema.safeParse(formObject);
  }else if(formObject.role==="blood_bank"){
    return bloodBankSchema.safeParse(formObject);
  }else{
    return signupSchema.safeParse(formObject);
  }
}else if(type==="new_blood_donation"){
  return newBloodDonationSchema.safeParse(formObject);
}else if(type==="existing_blood_donation"){
 return existingBloodDonationSchema.safeParse(formObject);
}
}