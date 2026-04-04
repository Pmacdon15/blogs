"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBlog,
  deleteBlog,
  deleteBlogSection,
  publishBlog,
  updateBlog,
  updateBlogSections,
} from "../dal/blogs";
import { UpdateSectionsSchema } from "../types/types";

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
    () => {
      revalidatePath(`/blog/${blogId}`);
      revalidatePath(`/edit/${blogId}`);
      revalidatePath(`/drafts`);
      revalidatePath("/");
      return { success: true };
    },
    (error) => {
      return { success: false, error: error.reason };
    },
  );
}

export async function publishBlogAction(blogId: string) {
  const result = await publishBlog(blogId);

  return result.match(
    () => {
      revalidatePath(`/blog/${blogId}`);
      revalidatePath(`/edit/${blogId}`);
      revalidatePath(`/drafts`);
      revalidatePath("/");
      redirect(`/blog/${blogId}`); // Route out to view published site
    },
    (error) => {
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
      revalidatePath(`/blog/${blogId}`);
      revalidatePath(`/edit/${blogId}`);
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

export async function deleteSectionAction(blogId: string, sectionId: string) {
  const result = await deleteBlogSection(sectionId);
  return result.match(
    () => {
      revalidatePath(`/blog/${blogId}`);
      revalidatePath(`/edit/${blogId}`);
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
    () => {
      revalidatePath(`/drafts`);
      revalidatePath(`/`);
      return { success: true };
    },
    (error) => {
      return { success: false, error: error.reason };
    },
  );
}
