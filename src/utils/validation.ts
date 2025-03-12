import {z} from "zod";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const baseSchema=z.object({
email:z.string().email("Invalid email format"),
password:z.string().min(6,"Password must be at least 6 characters"),
})
const signupSchema=baseSchema.extend({
  name:z.string().min(3,"Full Name must be at least 3 characters"),
  role:z.enum(["donor","blood_bank"],{required_error:"Role is required"}),
  contact:z.number().min(10,"Phone number must be 10 digits"),
  location:z.object({
    latitude:z.number().min(1,"Location is Required"),
    longitude:z.number().min(1,"Location is Required"),
  }),
  profile_picture:z.instanceof(File,{message:"Profile picture is required"}).refine((file)=>file.size<=MAX_FILE_SIZE,"Image must be less than 2Mb").
  refine((file)=>ACCEPTED_IMAGE_TYPES.includes(file.type),"Only .jpg, .jpeg, .png formats are allowed")
})

const donorSchema=signupSchema.extend({
  age:z.number().min(18,"Age must be at least 18").max(65,"Age must not exceed 65"),
  blood_group:z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],{required_error:"Blood Group is required"})
})
const bloodBankSchema=signupSchema.extend({
  blood_bank:z.string().min(3,"Blood bank name must be at least 3 characters"),
})
export const fromValidation = (formData:FormData,type:string) => {
  const formObject: Record<string, any> = Object.fromEntries(formData);
  formObject.location = JSON.parse(formData.get("location") as string);
  console.log(formObject);
if(type === 'login'){
return baseSchema.safeParse(formObject);
}else if(type==="signup"){
  if(formObject.role==="donor"){
    return donorSchema.safeParse(formObject);
  }else if(formObject.role==="blood_bank"){
    return bloodBankSchema.safeParse(formObject);
  }else{
    return signupSchema.safeParse(formObject);
  }
}
}