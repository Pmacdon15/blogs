import { Suspense } from "react";
import Author from "@/components/blog/author";
import CoverImage from "@/components/blog/cover-image";
import CreatedAt from "@/components/blog/created-at";
import Header from "@/components/blog/header";
import Sections from "@/components/blog/sections";
import { Badge } from "@/components/ui/badge";
import { getBlogSections, getBlogsById } from "@/lib/dal/blogs";

export default function BlogViewPage(props: PageProps<"/blog/[id]">) {
  const blogsPromise = props.params.then((params) =>
    getBlogsById(Array.isArray(params.id) ? params.id[0] : params.id),
  );
  const blogsTitlePromise = blogsPromise.then((blog) =>
    blog.error === null ? blog.data?.title : "",
  );
  const blogsCreatedAtPromise = blogsPromise.then((blog) =>
    blog.error === null ? blog.data?.created_at : "",
  );

  const blogsCoverImageUrlPromise = blogsPromise.then((blog) =>
    blog.error === null ? blog.data?.cover_image_url : "",
  );

  const blogsAuthorPromise = blogsPromise.then((blog) =>
    blog.error === null ? blog.data?.author_id : "",
  );

  const sectionsPromise = props.params.then((params) =>
    getBlogSections(Array.isArray(params.id) ? params.id[0] : params.id),
  );

  return (
    <main className="flex min-h-screen flex-col text-foreground bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-[50rem] h-[50rem] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <article className="max-w-4xl mx-auto w-full px-6 py-16 md:py-24 relative z-10 flex flex-col gap-12">
        {/* Header Segment */}
        <header className="flex flex-col gap-8 items-start">
          <Badge
            variant="outline"
            className="text-primary/80 border-primary/20 backdrop-blur-sm bg-primary/10"
          >
            Research & Conception
          </Badge>
          <Suspense
            fallback={
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
                {" "}
              </h1>
            }
          >
            <Header blogTitlePromise={blogsTitlePromise} />
          </Suspense>

          <div className="flex items-center gap-4 text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600" />
              <Suspense>
                <Author authorNamePromise={blogsAuthorPromise} />
              </Suspense>
            </div>
            <span>•</span>
            <Suspense>
              <CreatedAt createdAtPromise={blogsCreatedAtPromise} />
            </Suspense>
          </div>
        </header>

        <Suspense>
          <CoverImage
            titlePromise={blogsTitlePromise}
            coverImagePromise={blogsCoverImageUrlPromise}
          />
        </Suspense>

        <Suspense>
          <Sections sectionsPromise={sectionsPromise} />
        </Suspense>
      </article>
    </main>
  );
}
