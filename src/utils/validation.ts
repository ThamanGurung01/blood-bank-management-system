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
export const fromValidation = (formData:FormData,type:string) => {
  const formObject: Record<string, any> = Object.fromEntries(formData);
  formObject.location = JSON.parse(formData.get("location") as string);
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