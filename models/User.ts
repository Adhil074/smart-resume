// import mongoose from "mongoose";
// const userSchema=new mongoose.Schema({
//    username:{
//     type:String,
//     required:true,
//    },
//    email:{
//     type:String,
//     required:true,
//     unique:true,
//    },
//    password:{
//     type:String,
//     required:true,
//    },
   
// })
// const User=mongoose.model("User",userSchema);
// export default User;

import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
  name?: string;
  email: string;
  image?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

// ✅ THIS IS THE FIX
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;