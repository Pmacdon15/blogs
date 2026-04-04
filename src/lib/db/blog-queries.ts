import type { Blog, BlogSection } from "../dal/blogs";
import { sql } from "../db";

export async function getBlogsDb(): Promise<Blog[]> {
  const res =
    await sql`SELECT * FROM blogs WHERE published = true ORDER BY created_at DESC LIMIT 3;`;
  return res as unknown as Blog[];
}

export async function getDraftsDb(authorId: string): Promise<Blog[]> {
  const res =
    await sql`SELECT * FROM blogs WHERE published = false AND author_id = ${authorId} ORDER BY created_at DESC;`;
  return res as unknown as Blog[];
}

export async function getBlogByIdDb(id: string): Promise<Blog | null> {
  const res = await sql`SELECT * FROM blogs WHERE id = ${id} LIMIT 1;`;
  if (res.length === 0) return null;
  return res[0] as unknown as Blog;
}

export async function createBlogDb(id: string, authorId: string): Promise<boolean> {
  await sql`INSERT INTO blogs (id, author_id, title) VALUES (${id}, ${authorId}, 'Untitled Draft');`;
  return true;
}

export async function updateBlogDb(id: string, title: string, coverImageUrl: string | null): Promise<boolean> {
  await sql`UPDATE blogs SET title = ${title}, cover_image_url = ${coverImageUrl}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id};`;
  return true;
}

export async function publishBlogDb(id: string): Promise<boolean> {
  await sql`UPDATE blogs SET published = true, updated_at = CURRENT_TIMESTAMP WHERE id = ${id};`;
  return true;
}

export async function getBlogSectionsDb(
  blogId: string,
): Promise<BlogSection[]> {
  const res =
    await sql`SELECT * FROM blog_sections WHERE blog_id = ${blogId} ORDER BY order_index ASC;`;
  return res as unknown as BlogSection[];
}

export async function updateBlogSectionsDb(
  blogId: string,
  sections: BlogSection[],
): Promise<boolean> {
  await sql.transaction(
    sections.map(
      (sec) =>
        sql`
      INSERT INTO blog_sections (id, blog_id, type, content, sub_title, order_index)
      VALUES (${sec.id}, ${blogId}, ${sec.type}, ${sec.content}, ${sec.sub_title}, ${sec.order_index})
      ON CONFLICT (id) DO UPDATE SET 
        type = EXCLUDED.type,
        content = EXCLUDED.content,
        sub_title = EXCLUDED.sub_title,
        order_index = EXCLUDED.order_index,
        updated_at = CURRENT_TIMESTAMP;
    `,
    ),
  );
  return true;
}

export async function deleteBlogSectionDb(sectionId: string): Promise<boolean> {
  await sql`DELETE FROM blog_sections WHERE id = ${sectionId};`;
  return true;
}
