import { auth } from "@clerk/nextjs/server";
import { errAsync, okAsync } from "neverthrow";
import {
  deleteBlogSectionDb,
  getBlogByIdDb,
  getBlogSectionsDb,
  getBlogsDb,
  updateBlogSectionsDb,
  createBlogDb,
  updateBlogDb,
  publishBlogDb,
  getDraftsDb,
} from "../db/blog-queries";

export type Blog = {
  id: string;
  author_id: string;
  title: string;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogSection = {
  id: string;
  blog_id: string;
  type: string;
  content: string;
  sub_title: string | null;
  order_index: number;
};

export type FetchResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export async function getMockBlogs(): Promise<FetchResult<Blog[]>> {
  return {
    error: null,
    data: [
      {
        id: "mock-1",
        author_id: "user_1",
        title: "The Future of AI Design",
        cover_image_url: "/mock_blog_cover_1_1775268530117.png",
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "mock-2",
        author_id: "user_2",
        title: "Abstract Digital Artistry",
        cover_image_url: "/mock_blog_cover_2_1775268542674.png",
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "mock-3",
        author_id: "user_1",
        title: "Modern Programming Mindsets",
        cover_image_url: "/mock_blog_cover_3_1775268558086.png",
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  };
}

export async function getBlogs(): Promise<FetchResult<Blog[]>> {
  if (!process.env.DATABASE_URL) {
    return getMockBlogs();
  }

  try {
    const data = await getBlogsDb();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch blogs: ${e}` };
  }
}

export async function getDrafts(): Promise<FetchResult<Blog[]>> {
  const { userId } = await auth();
  if (!userId) return { data: null, error: "Unauthorized" };

  try {
    const data = await getDraftsDb(userId);
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch drafts: ${e}` };
  }
}

export async function getBlogsById(id: string): Promise<FetchResult<Blog>> {
  try {
    const data = await getBlogByIdDb(id);
    if (!data) return { data: null, error: "Blog not found" };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch blog by id: ${e}` };
  }
}

export async function getBlogSections(
  blogId: string,
): Promise<FetchResult<BlogSection[]>> {
  try {
    const data = await getBlogSectionsDb(blogId);
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch sections: ${e}` };
  }
}

export async function createBlog(blogId: string) {
  const { userId } = await auth();
  if (!userId) {
    return errAsync({
       reason: "Unauthorized: You must be logged in to draft a blog."
    } as const);
  }

  try {
    const result = await createBlogDb(blogId, userId);
    return okAsync(result);
  } catch (e) {
    console.error("Unknown Db error: ", e);
    return errAsync({
      reason: "Unknown Db error.",
    } as const);
  }
}

export async function updateBlog(blogId: string, title: string, coverImageUrl: string | null) {
  const { userId } = await auth();
  if (!userId) {
    return errAsync({
       reason: "Unauthorized: You must be logged in to modify metadata."
    } as const);
  }

  try {
    const result = await updateBlogDb(blogId, title, coverImageUrl);
    return okAsync(result);
  } catch (e) {
    console.error("Unknown Db error: ", e);
    return errAsync({
      reason: "Unknown Db error.",
    } as const);
  }
}

export async function publishBlog(blogId: string) {
  const { userId } = await auth();
  if (!userId) {
    return errAsync({
       reason: "Unauthorized: You must be logged in to publish."
    } as const);
  }

  try {
    const result = await publishBlogDb(blogId);
    return okAsync(result);
  } catch (e) {
    console.error("Unknown Db error: ", e);
    return errAsync({
      reason: "Unknown Db error.",
    } as const);
  }
}

export async function updateBlogSections(
  blogId: string,
  sections: BlogSection[],
) {
  const { userId } = await auth();
  if (!userId) {
    return errAsync({
      reason: "Unauthorized: You must be logged in to modify sequence.",
    } as const);
  }

  try {
    const result = await updateBlogSectionsDb(blogId, sections);
    return okAsync(result);
  } catch (e) {
    console.error("Unknown Db error: ", e);
    return errAsync({
      reason: "Unknown Db error.",
    } as const);
  }
}

export async function deleteBlogSection(sectionId: string) {
  const { userId } = await auth();
  if (!userId) {
    return errAsync({
      reason: "Unauthorized: You must be logged in to delete structural blocks.",
    } as const);
  }

  try {
    const result = await deleteBlogSectionDb(sectionId);
    return okAsync(result);
  } catch (e) {
    console.error("Unknown Db error: ", e);
    return errAsync({
      reason: "Unknown Db error.",
    } as const);
  }
}
