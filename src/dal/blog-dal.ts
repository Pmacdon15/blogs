import { auth } from "@clerk/nextjs/server";
import { getBlogByIdDb } from "@/db/blog-db";

export async function getBlogById(id: string) {
  const {  userId } = await auth.protect();
  if ( !userId) {
    return { error: "No authentication" };
  }

  try {
    const result = getBlogByIdDb(id, userId);
  } catch (e) {
    console.error("Unknown Db error: ", e);
  }
}
