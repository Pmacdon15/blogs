import { currentUser } from "@clerk/nextjs/server";

export async function isBlogOwner() {
  const user = await currentUser();
  
  if (!user) return false;

  // Check if the target email exists in Clerk's email array
  const isOwner = user.emailAddresses.some(
    (email) => email.emailAddress === process.env.BLOG_OWNERS_EMAIL
  );

  return isOwner;
}