import { auth, currentUser } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { errAsync, okAsync } from "neverthrow";
import { cacheLife, cacheTag } from "next/cache";
import { isBlogOwner } from "../auth";
import {
  createBlogDb,
  deleteBlogDb,
  deleteBlogSectionDb,
  getBlogByIdDb,
  getBlogSectionsDb,
  getBlogsDb,
  getDraftsDb,
  publishBlogDb,
  updateBlogDb,
  updateBlogSectionsDb,
} from "../db/blog-queries";

export type Blog = {
  id: string;
  author_id: string;
  author_name: string;
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

// export async function getMockBlogs(): Promise<FetchResult<Blog[]>> {
//   return {
//     error: null,
//     data: [
//       {
//         id: "mock-1",
//         author_id: "user_1",
//         author_name: "user_1",
//         title: "The Future of AI Design",
//         cover_image_url: "/mock_blog_cover_1_1775268530117.png",
//         published: true,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       },
//       {
//         id: "mock-2",
//         author_id: "user_2",
//         author_name: "user_2",
//         title: "Abstract Digital Artistry",
//         cover_image_url: "/mock_blog_cover_2_1775268542674.png",
//         published: true,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       },
//       {
//         id: "mock-3",
//         author_id: "user_1",
//         author_name: "user_1",
//         title: "Modern Programming Mindsets",
//         cover_image_url: "/mock_blog_cover_3_1775268558086.png",
//         published: true,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       },
//     ],
//   };
// }

export async function getBlogs(): Promise<FetchResult<Blog[]>> {
  "use cache";
  cacheLife("weeks");
  cacheTag("home-page-blogs");

  try {
    const data = await getBlogsDb();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch blogs: ${e}` };
  }
}

export async function getDrafts(): Promise<FetchResult<Blog[]>> {
  const { userId } = await auth();
  if (!userId)
    return { data: null, error: `"Unauthorized: You must be logged in.` };

  try {
    const data = await getDraftsDb(userId);
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch drafts: ${e}` };
  }
}

export async function getBlogByIdPublished(
  id: string,
): Promise<FetchResult<Blog>> {
  try {
    const data = await getBlogByIdDb(id);
    if (!data) return { data: null, error: "Blog not found" };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch blog by id: ${e}` };
  }
}

export async function getBlogById(id: string): Promise<FetchResult<Blog>> {
  const { userId } = await auth();
  if (!userId)
    return { data: null, error: `"Unauthorized: You must be logged in.` };

  try {
    const data = await getBlogByIdDb(id, false);
    if (!data) return { data: null, error: "Blog not found" };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch blog by id: ${e}` };
  }
}

export async function getBlogSectionsPublished(
  blogId: string,
): Promise<FetchResult<BlogSection[]>> {
  const isBlogOwnerResult = await isBlogOwner();
  if (!isBlogOwnerResult) return { data: null, error: `Failed to f` };
  try {
    const data = await getBlogSectionsDb(blogId);
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch sections: ${e}` };
  }
}

export async function getBlogSections(
  blogId: string,
): Promise<FetchResult<BlogSection[]>> {
  try {
    const data = await getBlogSectionsDb(blogId, false);
    return { data, error: null };
  } catch (e) {
    return { data: null, error: `Failed to fetch sections: ${e}` };
  }
}

export async function createBlog(blogId: string) {
  const [isBlogOwnerResult, user] = await Promise.all([
    isBlogOwner(),
    currentUser(),
  ]);
  if (!isBlogOwnerResult || !user) {
    return errAsync({
      reason: "Unauthorized: You must be logged in to draft a blog.",
    } as const);
  }

  try {
    const result = await createBlogDb(
      blogId,
      user?.id || "",
      user?.fullName || "",
    );
    return okAsync(result);
  } catch (e) {
    console.error("Unknown Db error: ", e);
    return errAsync({
      reason: "Unknown Db error.",
    } as const);
  }
}

export async function updateBlog(
  blogId: string,
  title: string,
  coverImageUrl: string | null,
) {
  const isOwnerResult = await isBlogOwner();
  if (!isOwnerResult) {
    return errAsync({
      reason: "Unauthorized: You must be logged in to delete.",
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
  const isOwnerResult = await isBlogOwner();
  if (!isOwnerResult) {
    return errAsync({
      reason: "Unauthorized: You must be logged in to delete.",
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
  const isOwnerResult = await isBlogOwner();
  if (!isOwnerResult) {
    return errAsync({
      reason: "Unauthorized: You must be logged in to delete.",
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
  const isOwnerResult = await isBlogOwner();
  if (!isOwnerResult) {
    return errAsync({
      reason: "Unauthorized: You must be logged in to delete.",
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

export async function deleteBlog(blogId: string) {
  const isOwnerResult = await isBlogOwner();
  if (!isOwnerResult) {
    return errAsync({
      reason: "Unauthorized: You must be logged in to delete.",
    } as const);
  }

  try {
    const result = await deleteBlogDb(blogId);
    return okAsync(result);
  } catch (e) {
    console.error("Unknown Db error: ", e);
    return errAsync({
      reason: "Unknown Db error.",
    } as const);
  }
}

export async function uploadImage(file: File) {
  const { userId } = await auth();
  if (!userId) {
    return errAsync({
      reason: "Unauthorized: You must be logged in to upload.",
    } as const);
  }

  try {
    const blob = await put(file.name, file, { access: "public" });
    return okAsync(blob.url);
  } catch (e) {
    console.error("Blob upload error: ", e);
    return errAsync({
      reason: "Failed to upload image.",
    } as const);
  }
}
