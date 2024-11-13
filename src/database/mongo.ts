import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const URI = process.env.MONGO_URI;
    if (URI) {
      await mongoose.connect(URI);
      console.log("Connect to database");
    } else {
      throw new Error("Database connection string not found");
    }
  } catch (err) {
    console.log(err);
  }
};

export default connectToDatabase;
