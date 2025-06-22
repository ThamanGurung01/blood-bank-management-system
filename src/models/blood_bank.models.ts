import { Schema,Document,model,models } from "mongoose";
export type Role= 'donor' | 'blood_bank' | 'admin';
export interface IBlood_Bank extends Document{
   user:Schema.Types.ObjectId;
   blood_bank:string;
   location:{
    latitude:number;
    longitude:number;
};
    contact:string;
    verified:boolean;
    document: {
        publicId: string;
        url:string;
        fileType: string;
    };
    profileImage:{
        url:string;
        publicId:string;
    };
}
const BloodBankSchema=new Schema<IBlood_Bank>({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
       },
       blood_bank:{
        type:String,
        required:true
       },
    location:{
        latitude:{
            type:Number,
            required:true
        },
        longitude:{
            type:Number,
            required:true
        },
    },
    contact:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    document: {
        publicId: String,
        url:String,
        fileType: String,
    },
    profileImage: {
    url: {
      type: String,
      default: '/defaultProfile.png',
    },
    publicId: {
      type: String,
      default: '',
    }
  },
},{timestamps:true});
export default models.Blood_bank || model<IBlood_Bank>("Blood_bank",BloodBankSchema);