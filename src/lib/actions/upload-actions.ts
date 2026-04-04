"use server";

import { uploadImage } from "../dal/blogs";

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { success: false as const, error: "No file provided" };
  }

  const result = await uploadImage(file);

  return result.match(
    (url) => {
      return { success: true as const, url };
    },
    (error) => {
      return { success: false as const, error: error.reason };
    },
  );
}
