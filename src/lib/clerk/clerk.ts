import { clerkClient } from "@clerk/nextjs/server";

export async function getAuthorName(authorId: string): Promise<string> {
  try {
    const client = await clerkClient();

    const user = await client.users.getUser(authorId);

    return `${user.firstName} ${user.lastName}`.trim() || "Unknown Author";
  } catch (e) {
    console.error(`Clerk lookup failed for ${authorId}:`, e);
    return "Deleted User";
  }
}
