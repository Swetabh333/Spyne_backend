import mongoose, { Document, Schema } from "mongoose";

interface user extends Document {
  Name: string;
  Email: string;
  Password: string;
}

const userSchema = new Schema<user>({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<user>("User", userSchema);
