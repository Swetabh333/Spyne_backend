import mongoose, { Document, Schema } from "mongoose";

export interface userDocument extends Document {
  Name: string;
  Email: string;
  Password: string;
}

const userSchema = new Schema<userDocument>({
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

export default mongoose.model<userDocument>("User", userSchema);
