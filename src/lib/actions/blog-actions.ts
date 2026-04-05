"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  type Blog,
  createBlog,
  deleteBlog,
  deleteBlogSection,
  publishBlog,
  updateBlog,
  updateBlogSections,
} from "../dal/blogs";
import { UpdateSectionsSchema } from "../types/types";

type UpdateBlogResult =
  | { success: true; data: Blog }
  | { success: false; error: string };

export async function createBlogAction(blogId: string) {
  const result = await createBlog(blogId);

  return result.match(
    () => {
      revalidatePath(`/drafts`);
      redirect(`/edit/${blogId}`);
    },
    (error) => {
      return { success: false, error: error.reason };
    },
  );
}

export async function createNewDraftAction(_formData?: FormData) {
  const { randomUUID } = await import("node:crypto");
  await createBlogAction(randomUUID());
}

export async function updateBlogAction(
  blogId: string,
  title: string,
  coverImageUrl: string | null,
) {
  if (!title || title.trim() === "") {
    return { success: false, error: "Title is required" };
  }

  const result = await updateBlog(blogId, title.trim(), coverImageUrl);

  return result.match(
    (data): UpdateBlogResult => {
      updateTag("home-page-blogs");
      updateTag(`blog-${blogId}-true`);
      updateTag(`blog-${blogId}-false`);
      updateTag(`sections-${blogId}-true`);
      updateTag(`sections-${blogId}-false`);
      updateTag(`drafts-${data.author_id}`);

      return { success: true, data };
    },
    (error): UpdateBlogResult => {
      return { success: false, error: error.reason };
    },
  );
}

export async function publishBlogAction(
  blogId: string,
): Promise<UpdateBlogResult> {
  const result = await publishBlog(blogId);

  return result.match(
    (data): UpdateBlogResult => {
      updateTag("home-page-blogs");
      updateTag(`blog-${blogId}-true`);
      updateTag(`blog-${blogId}-false`);
      updateTag(`sections-${blogId}-true`);
      updateTag(`sections-${blogId}-false`);
      updateTag(`drafts-${data.author_id}`);

      return { success: true, data };
    },
    (error): UpdateBlogResult => {
      return { success: false, error: error.reason };
    },
  );
}

export async function updateSectionsAction(blogId: string, sections: unknown) {
  const parsed = UpdateSectionsSchema.safeParse(sections);
  if (!parsed.success) {
    return { success: false, error: "Invalid section data provided." };
  }

  const result = await updateBlogSections(blogId, parsed.data);
  return result.match(
    () => {
      updateTag(`sections-${blogId}-true`);
      updateTag(`sections-${blogId}-false`);
      revalidatePath("/");
      return { success: true };
    },
    (error) => {
      return {
        success: false,
        error: error.reason,
      };
    },
  );
}

export async function deleteBlogAction(blogId: string) {
  const result = await deleteBlog(blogId);

  return result.match(
    (data): UpdateBlogResult => {
      updateTag("home-page-blogs");
      updateTag(`blog-${blogId}-true`);
      updateTag(`blog-${blogId}-false`);
      updateTag(`sections-${blogId}-true`);
      updateTag(`sections-${blogId}-false`);
      updateTag(`drafts-${data.author_id}`);

      return { success: true, data };
    },
    (error) => {
      return { success: false, error: error.reason };
    },
  );
}
