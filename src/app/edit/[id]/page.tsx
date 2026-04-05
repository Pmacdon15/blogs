import { Suspense } from "react";
import { EditBlogMetadataForm } from "@/components/editor/EditBlogMetadataForm";
import SectionEditor from "@/components/editor/SectionEditor";
import { isBlogOwner } from "@/lib/auth";
import {
  getBlogById,
  getBlogByIdPublished,
  getBlogSections,
  getBlogSectionsPublished,
} from "@/lib/dal/blogs";
import { getBlogIds } from "@/lib/db/blog-queries";

export async function generateStaticParams() {
  const result = await getBlogIds();

  if ("error" in result) {
    console.error(
      "GS failed to fetch IDs, falling back to dynamic rendering:",
      result.error,
    );
    return [];
  }

  return result.map((blog) => ({
    id: blog.blogId,
  }));
}

export default function EditBlogPage(props: PageProps<"/edit/[id]">) {
  const idPromise = props.params.then((params) =>
    Array.isArray(params.id) ? params.id[0] : params.id,
  );

  const blogPromise = idPromise.then((id) =>
    isBlogOwner().then((isOwner) => {
      const fetcher = isOwner ? getBlogById(id) : getBlogByIdPublished(id);

      return fetcher.then((res) => {
        if (res.error || !res.data) return null;
        return res.data;
      });
    }),
  );

  const sectionsDataPromise = idPromise.then((id) =>
    isBlogOwner().then((isOwner) => {
      const fetcher = isOwner
        ? getBlogSections(id)
        : getBlogSectionsPublished(id);

      return fetcher.then((res) =>
        res.error == null && res.data ? res.data : [],
      );
    }),
  );

  return (
    <main className="flex min-h-screen flex-col text-foreground bg-background selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full px-6 py-16 relative z-10">
        <Suspense>
          <EditBlogMetadataForm
            blogIdPromise={idPromise}
            promise={blogPromise}
          />
        </Suspense>

        <div className="flex flex-col gap-3 mb-10 mt-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
            Structural Sequence
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Structure, order, and present your abstract thoughts into visual
            blocks.
          </p>
        </div>
        <Suspense>
          <SectionEditor
            promise={sectionsDataPromise}
            blogIdPromise={idPromise}
          />
        </Suspense>
      </div>
    </main>
  );
}
