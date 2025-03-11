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
  location:z.object({
    latitude:z.number().min(1,"Location is Required"),
    longitude:z.number().min(1,"Location is Required"),
  }),
  profile_picture:z.instanceof(File,{message:"Profile picture is required"}).refine((file)=>file.size<=MAX_FILE_SIZE,"Image must be less than 2Mb").
  refine((file)=>ACCEPTED_IMAGE_TYPES.includes(file.type),"Only .jpg, .jpeg, .png formats are allowed")
})
export const fromValidation = (formData:FormData,type:string) => {
  const formObject: Record<string, any> = Object.fromEntries(formData);
  formObject.location = JSON.parse(formData.get("location") as string);
  console.log(formObject);
if(type === 'login'){
return baseSchema.safeParse(formObject);
}else if(type==="signup"){
  return signupSchema.safeParse(formObject);
}
}