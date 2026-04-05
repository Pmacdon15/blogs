import { cacheLife, cacheTag } from "next/cache";
import type { Blog, BlogSection } from "../dal/blogs";
import { sql } from "../db";

export async function getBlogIds(): Promise<
  { blogId: string }[] | { error: string }
> {
  
  try {
    const result = await sql`
      SELECT id FROM blogs WHERE published = true
    `;

    return result.map((blog) => ({
      blogId: blog.id,
    }));
  } catch (error) {
    console.error("Error fetching all blog IDs:", error);
    return { error: "Failed to fetch all blog IDs" };
  }
}
export async function getBlogsDb(): Promise<Blog[]> {
  const res =
    await sql`SELECT * FROM blogs WHERE published = true ORDER BY created_at DESC LIMIT 3;`;
  return res as unknown as Blog[];
}

export async function getDraftsDb(authorId: string): Promise<Blog[]> {
  "use cache";
  cacheTag(`drafts-${authorId}`);
  cacheLife("weeks");
  const res =
    await sql`SELECT * FROM blogs WHERE published = false AND author_id = ${authorId} ORDER BY created_at DESC;`;
  return res as unknown as Blog[];
}

export async function getBlogByIdDb(
  id: string,
  published = true,
): Promise<Blog | null> {
  "use cache";
  cacheTag(`blog-${id}-${published}`);
  cacheLife("weeks");
  const res = await sql`
    SELECT * FROM blogs 
    WHERE id = ${id} 
    -- If published is true, filter. If false, return either status.
    AND (published = true OR ${published} = false)
    LIMIT 1;
  `;

  if (res.length === 0) return null;
  return res[0] as unknown as Blog;
}

export async function createBlogDb(
  id: string,
  authorId: string,
  authorName: string,
): Promise<boolean> {
  await sql`INSERT INTO blogs (id, author_id, author_name, title) VALUES (${id}, ${authorId}, ${authorName}, 'Untitled Draft');`;
  return true;
}

export async function updateBlogDb(
  id: string,
  title: string,
  coverImageUrl: string | null,
): Promise<Blog> {
  const res =
    await sql`UPDATE blogs SET title = ${title}, cover_image_url = ${coverImageUrl}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id} RETURNING *;`;
  return res[0] as unknown as Blog;
}

export async function publishBlogDb(id: string): Promise<Blog> {
  const res = await sql`
    UPDATE blogs 
    SET 
      published = true, 
      updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${id}
    RETURNING *;
  `;

  return res[0] as unknown as Blog;
}

export async function getBlogSectionsDb(
  blogId: string,
  published = true,
): Promise<BlogSection[]> {
  "use cache";
  cacheTag(`sections-${blogId}-${published}`);
  cacheLife("weeks");
  const res = await sql`
    SELECT bs.* FROM blog_sections bs
    JOIN blogs b ON bs.blog_id = b.id
    WHERE bs.blog_id = ${blogId} 
    -- If published is true, enforce it. If false, allow both.
    AND (b.published = true OR ${published} = false)
    ORDER BY bs.order_index ASC;
  `;

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

export async function deleteBlogDb(id: string): Promise<Blog> {
  const res = await sql`DELETE FROM blogs WHERE id = ${id} RETURNING *;`;
  return res[0] as unknown as Blog;
}
