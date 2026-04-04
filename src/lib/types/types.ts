import z from "zod";

export const BlogSectionSchema = z.object({
  id: z.string(),
  blog_id: z.string(),
  type: z.enum(["title", "image", "code", "paragraph"]),
  content: z.string(),
  sub_title: z.string().nullable(),
  order_index: z.number().int(),
});

export const UpdateSectionsSchema = z.array(BlogSectionSchema);