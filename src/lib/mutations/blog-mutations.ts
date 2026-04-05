"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteBlogAction,
  publishBlogAction,
  updateBlogAction,
  updateSectionsAction,
} from "@/lib/actions/blog-actions";

export function useDeleteBlogMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (blogId: string) => {
      return deleteBlogAction(blogId);
    },
    onSuccess: (res) => {
      if (res && res.success === false) {
        toast.error(("error" in res ? res.error : null) || "Failed to delete");
      } else {
        toast.success("Blog successfully deleted");
        router.push(`/`);
      }
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${String(error)}`);
    },
  });
}

export function usePublishBlogMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (blogId: string) => {
      return publishBlogAction(blogId);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Sequence is now published globally!");
        router.push(`/blog/${res.data.id}`);
      } else {
        toast.error(("error" in res ? res.error : null) || "Failed to publish");
      }
    },
    onError: (error) => {
      toast.error(`Failed to publish: ${String(error)}`);
    },
  });
}

export function useUpdateBlogMutation() {
  return useMutation({
    mutationFn: async ({
      blogId,
      title,
      coverImageUrl,
    }: {
      blogId: string;
      title: string;
      coverImageUrl: string | null;
    }) => {
      return updateBlogAction(blogId, title, coverImageUrl);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Configuration preserved");
      } else if ("error" in res) {
        toast.error((res.error as string) || "Failed to save configuration");
      }
    },
    onError: (error) => {
      toast.error("Failed to save: " + String(error));
    },
  });
}

export function useUpdateSection(blogId: string) {
  return useMutation({
    mutationFn: async (sections: unknown) => {
      const res = await updateSectionsAction(blogId, sections);

      if (!res.success) {
        throw new Error("error" in res ? res.error : "Unknown error");
      }

      return res;
    },
    onSuccess: () => {
      toast.success("Sequence saved successfully", {
        description: "Your abstract draft has been recorded in the datastore.",
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to orchestrate sequence", {
        description: err.message,
      });
    },
  });
}
