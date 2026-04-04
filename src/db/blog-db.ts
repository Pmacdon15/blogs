import { neon } from "@neondatabase/serverless";
export async function getBlogByIdDb(id: string, userId: string) {
  const sql = neon(String(process.env.DATABASE_URL));
  const blog =
    await sql`SELECT * FROM blogs WHERE id = ${id} AND userId = ${userId}`;
  return blog;
}
