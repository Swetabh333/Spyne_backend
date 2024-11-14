import { supabase } from "../config/supabaseConfig";
import { v4 as uuidv4 } from "uuid";

//helper function for uploading images
export const uploadImage = async (
  file: Express.Multer.File,
  userId: string,
) => {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `users/${userId}/cars/${fileName}`;

  const { error } = await supabase.storage
    .from("spyne-bucket")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error("Error uploading image");
  }

  const { data } = supabase.storage.from("spyne-bucket").getPublicUrl(filePath);
  return data.publicUrl;
};

//helper function for deleting the image
export const deleteImage = async (imageUrl: string, userId: string) => {
  const fileName = imageUrl.split("/").pop();
  if (!fileName) throw new Error("Invalid image URL");

  const filePath = `users/${userId}/cars/${fileName}`;

  const { error } = await supabase.storage
    .from("spyne-bucket")
    .remove([filePath]);

  if (error) {
    throw new Error("Error deleting image");
  }
};
//helper for deleting all images
export const deleteUserImages = async (userId: string) => {
  const { data: files, error: listError } = await supabase.storage
    .from("spyne-bucket")
    .list(`users/${userId}/cars`);

  if (listError) {
    throw new Error("Error listing user images");
  }

  if (files && files.length > 0) {
    const filePaths = files.map((file) => `users/${userId}/cars/${file.name}`);

    const { error: deleteError } = await supabase.storage
      .from("spyne-bucket")
      .remove(filePaths);

    if (deleteError) {
      throw new Error("Error deleting user images");
    }
  }
};
