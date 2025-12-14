import mongoose from "mongoose";
const url = "mongodb://127.0.0.1:27017/ERP";

const connectDB = async () => {
  return await mongoose.connect(url);
};

connectDB().then(() => console.log("DB Connected"))
  .catch((e) => console.log("Error in DB Connection", e));

export default connectDB;