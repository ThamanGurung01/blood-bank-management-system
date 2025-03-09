import { Schema,Document,model,models } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export type Role= 'donor' | 'blood_bank' | 'admin';
export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    role:Role;
}
const UserSchema=new Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['donor','blood_bank','admin'],
        default:'donor'
    }
},{timestamps:true});

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  
  UserSchema.methods.isPasswordCorrect = async function (
    password: string
  ): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  };
  
  UserSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );
  };
  
  UserSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );
  };
export default models.Donor || model<IUser>("user",UserSchema);