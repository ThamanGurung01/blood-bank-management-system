import mongoose from "mongoose";
let isConnected=false;
export const connectToDb=async()=>{
mongoose.set('strictQuery',true);
if(isConnected){
    console.log("MongoDb is already connected");
    return;
}else{
    try{
        await mongoose.connect(process.env.MONGODB_URI||"mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0",{
            dbName:"blood_bank_management",
        })
        isConnected=true;
        console.log("MongoDb connected");
    }catch(error){
        console.error(error);
    }
}
}