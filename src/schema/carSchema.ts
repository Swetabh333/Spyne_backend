import mongoose, { Date, Document,Schema,Types } from "mongoose";
import { userDocument } from "./userSchema";

export interface carDocument extends Document{
	title:string;
	description:string;
	tags:string[];
	imageUrls:string[],
	imageCount:number,
	user:Types.ObjectId | userDocument;
	createdAt:Date,
	updatedAt:Date
}

const carSchema = new Schema<carDocument>({
	title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
      maxlength: 10,
    },
    imageCount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Car",carSchema);
